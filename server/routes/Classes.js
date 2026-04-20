import db from "../../db/db.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("classes");

const queries = {
  getUsersAssignedClasses: sql("getUsersAssignedClasses.sql"),
};

export const getUsersAssignedClasses = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const data = await db.query(queries.getUsersAssignedClasses, { userId });
  res.status(200).json(data);
});
