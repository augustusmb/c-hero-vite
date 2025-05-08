import db from "../../db/db.js";
import path from "path";

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, "/db/queries/users/", file);
  return new QueryFile(fullPath, { minify: true });
};

const queries = {
  getUserByPhone: sql("getUserByPhone.sql"),
  fetchAllUsers: sql("fetchAllUsers.sql"),
  updateUserInfo: sql("updateUserInfo.sql"),
  deleteUser: sql("deleteUser.sql"),
  acceptTermsAndConditions: sql("acceptTermsAndConditions.sql"),
  deleteUserSpecificClasses: sql("deleteUserSpecificClasses.sql"),
  insertNewCompany:
    "INSERT INTO companies (name) VALUES (${name}) RETURNING id",
  insertNewPort: "INSERT INTO ports (name) VALUES (${name}) RETURNING id",
  insertNewVessel: "INSERT INTO vessels (name) VALUES (${name}) RETURNING id",
};

export async function getUserByPhone(req, res) {
  const { phone } = req.query;
  const result = await db.query(queries.getUserByPhone, { phone });
  res.status(200).json(result);
}

export async function fetchAllUsers(req, res) {
  let allUserData = await db.any(queries.fetchAllUsers);
  res.status(200).json(allUserData);
}

export function deleteUser(req, res) {
  console.log("Deleting user in server with id: ", req.query.userId);
  const { userId } = req.query;
  db.query(queries.deleteUser, { userId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log("Error deleting user: ", err));
}

export async function updateUserInfo(req, res) {
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

  console.log("POSITION: ", position);

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

        // Update the user with the resolved IDs
        await t.none(queries.updateUserInfo, {
          id,
          first_name,
          last_name,
          email,
          phone,
          position_type: position.value,
          company_id: companyId,
          vessel_id: vesselId,
          port_id: portId,
        });

        return { success: true };
      } catch (innerError) {
        // Log specific error within transaction
        console.error("Transaction error:", innerError);
        throw innerError; // Re-throw to trigger rollback
      }
    });

    res.status(200).json({
      message: "User info updated successfully",
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
      console.error("Error updating user info:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user info",
        error: error.message,
      });
    }
  }
}

export async function updateUserInfoAndProducts(req, res) {
  const {
    id,
    name,
    first_name,
    last_name,
    email,
    title,
    company,
    vessel,
    port,
    newlyAddedProducts,
    newlyRemovedProducts,
  } = req.body.params;

  let insertQuery = updateUserProducts(
    Object.keys(newlyAddedProducts),
    id,
    newlyAddedProducts,
  );
  let deleteQuery = deleteUserSpecificClasses(
    Object.keys(newlyRemovedProducts),
    id,
  );

  await Promise.all([
    db.none(insertQuery),
    db.none(deleteQuery),
    db.none(queries.updateUserInfo, {
      id,
      name,
      first_name,
      last_name,
      email,
      title,
      company,
      vessel,
      port,
    }),
  ])
    .then(() => {
      console.log("All SQL commands executed");
      res.status(200).json({ message: "User info updated successfully" });
    })
    .catch((err) => {
      console.log("Error updating user products: ", err);
      res.status(500).json({ message: "Error updating user info" });
    });
}

function updateUserProducts(products, user_id) {
  if (products.length === 0) return "-- This is a comment";

  let classes = [];
  products.forEach((product) => {
    let suffixes = ["a", "b", "c", "d"];
    if (product === "vr") {
      suffixes.push("p");
    }
    classes.push(suffixes.map((suffix) => `${product}_${suffix}`));
  });
  classes = classes.flat();

  let values = classes.map((product_id) => `('${product_id}', '${user_id}')`);
  let valuesPart = values.join(", ");
  let insertStatement = `INSERT INTO users_products (product_id, user_id) VALUES ${valuesPart}`;
  return insertStatement;
}

function deleteUserSpecificClasses(products, user_id) {
  if (products.length === 0) return "-- This is a comment";

  let classes = [];
  products.forEach((product) => {
    classes.push([
      `${product}_a`,
      `${product}_b`,
      `${product}_c`,
      `${product}_d`,
    ]);
  });
  classes = classes.flat();

  let productIds = classes.map((id) => `'${id}'`).join(", ");
  let deleteStatement = `DELETE FROM users_products WHERE product_id IN (${productIds}) AND user_id = ${user_id}`;
  return deleteStatement;
}

export function acceptTermsAndConditions(req, res) {
  const { userId } = req.body.params;

  db.query(queries.acceptTermsAndConditions, { userId })
    .then((data) => {
      console.log("User terms and conditions updated successfully");
      res.status(200).json(data);
    })
    .catch((err) =>
      console.log("Error updating user accepting terms and conditions: ", err),
    );
}
