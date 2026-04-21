import db from "../../db/db.js";
import pLimit from "p-limit";
import { notifyAdminsNewSignUp, signUpSmsToUser } from "../sms.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resolveLookupId } from "../utils/lookupHelpers.js";

const sql = createSqlLoader("users");

const queries = {
  insertUser: sql("insertUser.sql"),
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

    const rescueDavitType = `${rescueDavit}${rescueDavitMount}`;
    const allClassIds = [
      ...generateClassIds(rescuePole),
      ...generateClassIds(rescueDavitType),
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

export async function signUpUser(req, res) {
  console.log(`You've made it into user sign up`);
  console.log("Data: ", req.body.data);

  const data = req.body.data;
  const trimmedData = Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = typeof value === "string" ? value.trim() : value;
    return acc;
  }, {});

  const {
    firstName,
    lastName,
    phone,
    email,
    company,
    port,
    vessel,
    title,
    rescuePole,
    mount,
    rescueDavit,
  } = trimmedData;

  const name = `${firstName} ${lastName}`;
  let level = null;

  switch (title) {
    case "Captain":
      level = "1";
      break;
    case "Shoreside":
      level = "2";
      break;
    case "Crew":
      level = "1";
      break;
    default:
      console.log("Unknown fruit");
  }

  try {
    const [{ id: user_id }] = await db.query(queries.insertUser, {
      name,
      phone,
      email,
      company,
      port,
      vessel,
      title,
      level,
    });

    const usersProducts = [];

    if (checkValidDavitAndMount(rescueDavit, mount)) {
      const davitType = rescueDavit[7];
      const mountType = mount.includes("flat") ? "f" : "b";
      const davitCode = `${davitType}${mountType}`;
      usersProducts.push(davitCode);
    }

    if (checkValidRescuePole(rescuePole)) {
      const rescuePoleCode = rescuePole.slice(0, 2).toLowerCase();
      usersProducts.push(rescuePoleCode);
    }

    const usersClasses = usersProducts.flatMap((product) => [
      `${product}_a`,
      `${product}_b`,
      `${product}_c`,
      `${product}_d`,
    ]);

    const limit = pLimit(4);

    let promises = usersClasses.map((class_id) =>
      limit(() =>
        db.query(queries.insertUsersProducts, { class_id, user_id }),
      ),
    );
    await Promise.all(promises);

    res.status(200).json("success inserting user and assigning products");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        "error inserting user and assigning products, check if duplicate phone exists in the database.",
      );
  }
}

function checkValidRescuePole(rescuePole) {
  const validRescuePoles = ["RK", "VR14", "RS14", "HR14"];
  return validRescuePoles.includes(rescuePole);
}

function checkValidDavitAndMount(rescueDavit, mount) {
  const validDavitMounts = ["Tugboat Bitt Mount", "Side of Boat Flat Mount"];
  const validRescueDavits = [
    "Series 3 Fixed Davit",
    "Series 5 Hinged Davit",
    "Series 7 Swivel Davit",
    "Series 9 Man Rated",
  ];
  return (
    validDavitMounts.includes(mount) && validRescueDavits.includes(rescueDavit)
  );
}
