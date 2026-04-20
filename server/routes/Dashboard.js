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

  const vesselData = await db.one("SELECT * FROM vessels WHERE id = $1", [
    vessel_id,
  ]);
  const vesselProducts = await db.any(
    "SELECT * FROM vessels_products WHERE vessel_id = $1",
    [vesselData.id],
  );
  const dashboardUsers = await db.query(queries.getDashboardUsers, [vessel_id]);
  const usersWithProductProgressMaps = await Promise.all(
    dashboardUsers.map((dashUser) =>
      appendUserFullProductProgressMap(dashUser),
    ),
  );

  res.status(200).json({
    vesselName: vesselData.name,
    vesselProducts,
    usersWithProductProgressMaps,
  });
});
