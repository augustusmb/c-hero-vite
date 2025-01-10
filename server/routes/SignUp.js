import db from "../../db/db.js";
import path from "path";
import pLimit from "p-limit";
import { newUserSignUpToWayne } from "../sms.js";

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, "/db/queries/users/", file);
  return new QueryFile(fullPath, { minify: true });
};

const queries = {
  insertUser: sql("insertUser.sql"),
  insertUsersProducts: sql("insertUsersProducts.sql"),
  fetchFormOptions: sql("fetchFormOptions.sql"),
  signUpUserNew: sql("signUpUserNew.sql"),
  insertNewCompany:
    "INSERT INTO companies (name) VALUES (${name}) RETURNING id",
  insertNewPort: "INSERT INTO ports (name) VALUES (${name}) RETURNING id",
  insertNewVessel: "INSERT INTO vessels (name) VALUES (${name}) RETURNING id",
};

export async function fetchFormOptions(req, res) {
  try {
    const options = await db.query(queries.fetchFormOptions);
    return res.status(200).json(options[0]); // Will return {companies: [...], vessels: [...], ports: [...]}
  } catch (error) {
    console.error("Error fetching form options:", error);
    return res.status(500).json({
      message: "Error fetching form options",
      error: error.message,
    });
  }
}

const SUFFIXES = Object.freeze(["a", "b", "c", "d"]);

const generateClassIds = (product) =>
  SUFFIXES.map((suffix) => `${product}_${suffix}`);

export async function signUpUserNew(req, res) {
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

  try {
    const result = await db.tx(async (t) => {
      try {
        // Handle potential new entries with proper error handling
        const companyId = company.__isNew__
          ? await t.one(
              queries.insertNewCompany,
              {
                name: company.label,
              },
              (row) => row.id,
            )
          : company.value;

        const portId = port.__isNew__
          ? await t.one(
              queries.insertNewPort,
              {
                name: port.label,
              },
              (row) => row.id,
            )
          : port.value;

        const vesselId = vessel.__isNew__
          ? await t.one(
              queries.insertNewVessel,
              {
                name: vessel.label,
              },
              (row) => row.id,
            )
          : vessel.value;

        // Insert the user with the resolved IDs
        const newUser = await t.one(
          queries.signUpUserNew,
          {
            firstName,
            lastName,
            phone,
            email,
            position_type: position.value,
            companyId,
            portId,
            vesselId,
          },
          (row) => row,
        );

        const userId = newUser.id;
        const rescueDavitType = `${rescueDavit}${rescueDavitMount}`;
        const rescuePoleClassIds = generateClassIds(rescuePole);
        const davitClassIds = generateClassIds(rescueDavitType);

        // Handle product associations within the same transaction
        const limit = pLimit(4);
        const allClassIds = [...rescuePoleClassIds, ...davitClassIds];

        const productPromises = allClassIds.map((product_id) =>
          limit(() =>
            t.none(queries.insertUsersProducts, {
              product_id,
              user_id: userId,
            }),
          ),
        );

        await Promise.all(productPromises);
        newUserSignUpToWayne(firstName, lastName, phone, company, vessel, port);
        return newUser; // Return the created user data
      } catch (innerError) {
        // Log specific error within transaction
        console.error("Transaction error:", innerError);
        throw innerError; // Re-throw to trigger rollback
      }
    });

    // Success response
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle specific error types
    if (error.code === "23505") {
      // Unique constraint violation
      res.status(409).json({
        success: false,
        error: "A record with this information already exists",
      });
    } else if (error.code === "23503") {
      // Foreign key violation
      res.status(400).json({
        success: false,
        error: "Invalid reference to related data",
      });
    } else {
      console.error(
        "Error in server, file SignUp.js. Error signing up a new user:",
        error,
      );
      res.status(500).json({
        success: false,
        error: "Failed to create user, phone number possibly already in use",
      });
    }
  }
}

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

    let promises = usersClasses.map((product_id) =>
      limit(() =>
        db.query(queries.insertUsersProducts, { product_id, user_id }),
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
