import db from "../../db/db.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resolveLookupId } from "../utils/lookupHelpers.js";

const pgp = db.$config.pgp;
const sql = createSqlLoader("users");

const queries = {
  getUserByPhone: sql("getUserByPhone.sql"),
  fetchAllUsers: sql("fetchAllUsers.sql"),
  updateUserInfo: sql("updateUserInfo.sql"),
  deleteUser: sql("deleteUser.sql"),
  acceptTermsAndConditions: sql("acceptTermsAndConditions.sql"),
  insertNewCompany:
    "INSERT INTO companies (name) VALUES (${name}) RETURNING id",
  insertNewPort: "INSERT INTO ports (name) VALUES (${name}) RETURNING id",
  insertNewVessel: "INSERT INTO vessels (name) VALUES (${name}) RETURNING id",
};

const usersProductsCS = new pgp.helpers.ColumnSet(["class_id", "user_id"], {
  table: "users_products",
});

const classIdsForProduct = (product) => {
  const suffixes =
    product === "vr" ? ["a", "b", "c", "d", "p"] : ["a", "b", "c", "d"];
  return suffixes.map((s) => `${product}_${s}`);
};

export const getUserByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.query;
  const result = await db.query(queries.getUserByPhone, { phone });
  res.status(200).json(result);
});

export const fetchAllUsers = asyncHandler(async (_req, res) => {
  const allUserData = await db.any(queries.fetchAllUsers);
  res.status(200).json(allUserData);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const data = await db.query(queries.deleteUser, { userId });
  res.status(200).json(data);
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    position,
    company,
    vessel,
    port,
  } = req.body.params;

  await db.tx(async (t) => {
    const [companyId, portId, vesselId] = await Promise.all([
      resolveLookupId(t, company, queries.insertNewCompany),
      resolveLookupId(t, port, queries.insertNewPort),
      resolveLookupId(t, vessel, queries.insertNewVessel),
    ]);

    await t.none(queries.updateUserInfo, {
      id,
      first_name,
      last_name,
      email,
      phone,
      position_type: position?.value ?? null,
      company_id: companyId,
      vessel_id: vesselId,
      port_id: portId,
    });
  });

  res.status(200).json({ success: true });
});

export const updateUserInfoAndProducts = asyncHandler(async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    position,
    company,
    vessel,
    port,
    newlyAddedProducts,
    newlyRemovedProducts,
  } = req.body.params;

  await db.tx(async (t) => {
    const [companyId, portId, vesselId] = await Promise.all([
      resolveLookupId(t, company, queries.insertNewCompany),
      resolveLookupId(t, port, queries.insertNewPort),
      resolveLookupId(t, vessel, queries.insertNewVessel),
    ]);

    await t.none(queries.updateUserInfo, {
      id,
      first_name,
      last_name,
      email,
      phone,
      position_type: position?.value ?? null,
      company_id: companyId,
      vessel_id: vesselId,
      port_id: portId,
    });

    const addedProducts = Object.keys(newlyAddedProducts ?? {});
    if (addedProducts.length > 0) {
      const rows = addedProducts
        .flatMap(classIdsForProduct)
        .map((class_id) => ({ class_id, user_id: id }));
      await t.none(pgp.helpers.insert(rows, usersProductsCS));
    }

    const removedProducts = Object.keys(newlyRemovedProducts ?? {});
    if (removedProducts.length > 0) {
      const classIds = removedProducts.flatMap(classIdsForProduct);
      await t.none(
        "DELETE FROM users_products WHERE class_id IN ($1:csv) AND user_id = $2",
        [classIds, id],
      );
    }
  });

  res.status(200).json({ success: true });
});

export const acceptTermsAndConditions = asyncHandler(async (req, res) => {
  const { userId } = req.body.params;
  const data = await db.query(queries.acceptTermsAndConditions, { userId });
  res.status(200).json(data);
});
