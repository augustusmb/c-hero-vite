import db from "../../db/db.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("products");

const queries = {
  getSerialNumbers: sql("getSerialNumbers.sql"),
  deleteSerialNumber: sql("deleteSerialNumber.sql"),
  addSerialNumber: sql("addSerialNumber.sql"),
  listProducts: "SELECT id, name, category FROM products ORDER BY id",
};

export const listProducts = asyncHandler(async (_req, res) => {
  const data = await db.any(queries.listProducts);
  res.status(200).json(data);
});

export const getSerialNumbers = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const data = await db.query(queries.getSerialNumbers, { userId });
  res.status(200).json(data);
});

export const deleteSerialNumber = asyncHandler(async (req, res) => {
  const { userId, serialNumber } = req.query;
  await db.none(queries.deleteSerialNumber, { userId, serialNumber });
  res.status(200).json({ success: true });
});

export const addSerialNumber = asyncHandler(async (req, res) => {
  const { userId, serialNumber } = req.body;
  await db.none(queries.addSerialNumber, { userId, serialNumber });
  res.status(200).json({ success: true });
});
