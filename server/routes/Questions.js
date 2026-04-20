import db from "../../db/db.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("questions");

const queries = {
  getQuestions: sql("getQuestions.sql"),
};

export const getQuestions = asyncHandler(async (req, res) => {
  const { classId } = req.query;
  const result = await db.any(queries.getQuestions, { classId });
  res.status(200).json(result);
});
