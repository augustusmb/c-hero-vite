import db from "../../db/db.js";
import { appendUserFullProductProgressMap } from "../utils/utilFunctions.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("dashboard");

const queries = {
  getDashboardUsers: sql("getDashboardUsers.sql"),
};

export const getDashboardUsers = asyncHandler(async (req, res) => {
  const { vessel_id } = req.query;

  const [vesselData, dashboardUsers, products] = await Promise.all([
    db.one("SELECT * FROM vessels WHERE id = $1", [vessel_id]),
    db.query(queries.getDashboardUsers, [vessel_id]),
    db.any("SELECT id, name, category FROM products"),
  ]);
  const usersWithProductProgressMaps = await Promise.all(
    dashboardUsers.map((dashUser) =>
      appendUserFullProductProgressMap(dashUser, products),
    ),
  );

  res.status(200).json({
    vesselName: vesselData.name,
    usersWithProductProgressMaps,
  });
});
