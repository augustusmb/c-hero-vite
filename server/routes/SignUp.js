import db from "../../db/db.js";
import pLimit from "p-limit";
import { notifyAdminsNewSignUp, signUpSmsToUser } from "../sms.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resolveLookupId } from "../utils/lookupHelpers.js";

const sql = createSqlLoader("users");

const queries = {
  insertUsersProducts: sql("insertUsersProducts.sql"),
  fetchFormOptions: sql("fetchFormOptions.sql"),
  signUpUserNew: sql("signUpUserNew.sql"),
  checkPhoneExists: sql("checkPhoneExists.sql"),
  insertNewCompany:
    "INSERT INTO companies (name) VALUES (${name}) RETURNING id",
  insertNewPort: "INSERT INTO ports (name) VALUES (${name}) RETURNING id",
  insertNewVessel: "INSERT INTO vessels (name) VALUES (${name}) RETURNING id",
};

export const fetchFormOptions = asyncHandler(async (_req, res) => {
  const options = await db.query(queries.fetchFormOptions);
  res.status(200).json(options[0]);
});

export const checkPhoneAvailable = asyncHandler(async (req, res) => {
  const { phone } = req.query;
  if (typeof phone !== "string" || !/^\+[1-9]\d{1,14}$/.test(phone)) {
    return res.status(400).json({ error: "Invalid phone format" });
  }
  const { exists } = await db.one(queries.checkPhoneExists, { phone });
  res.status(200).json({ available: !exists });
});

const SUFFIXES = Object.freeze(["a", "b", "c", "d", "p"]);

const generateClassIds = (product) =>
  SUFFIXES.map((suffix) =>
    product === "vr"
      ? `${product}_${suffix}`
      : suffix !== "p"
      ? `${product}_${suffix}`
      : null,
  ).filter(Boolean);

export const signUpUserNew = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    company,
    port,
    vessel,
    position,
    rescuePole,
    rescueDavit,
    rescueDavitMount,
  } = req.body.data;

  const hasCompleteDavit = rescueDavit && rescueDavitMount;
  if (!rescuePole && !hasCompleteDavit) {
    return res
      .status(400)
      .json({ error: "Select a rescue pole, a davit, or both." });
  }

  const newUser = await db.tx(async (t) => {
    const [companyId, portId, vesselId] = await Promise.all([
      resolveLookupId(t, company, queries.insertNewCompany),
      resolveLookupId(t, port, queries.insertNewPort),
      resolveLookupId(t, vessel, queries.insertNewVessel),
    ]);

    const user = await t.one(
      queries.signUpUserNew,
      {
        firstName,
        lastName,
        phone,
        email,
        position_type: position?.value ?? null,
        companyId,
        portId,
        vesselId,
      },
      (row) => row,
    );

    const davitProductCode =
      rescueDavit && rescueDavitMount
        ? `${rescueDavit}${rescueDavitMount}`
        : null;

    const allClassIds = [
      ...(rescuePole ? generateClassIds(rescuePole) : []),
      ...(davitProductCode ? generateClassIds(davitProductCode) : []),
    ];

    const limit = pLimit(4);
    await Promise.all(
      allClassIds.map((class_id) =>
        limit(() =>
          t.none(queries.insertUsersProducts, {
            class_id,
            user_id: user.id,
          }),
        ),
      ),
    );

    return user;
  });

  notifyAdminsNewSignUp({
    firstName,
    lastName,
    phone,
    email,
    company,
    vessel,
    port,
    position,
    rescuePole,
    rescueDavit,
    rescueDavitMount,
  });
  signUpSmsToUser(phone);

  res.status(201).json({ success: true, data: newUser });
});
