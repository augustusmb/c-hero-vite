import db from "../../db/db.js";
import path from "path";
import { appendUserFullProductProgressMap } from "../utils/utilFunctions.js";

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, "/db/queries/dashboard/", file);
  return new QueryFile(fullPath, { minify: true });
};

const queries = {
  getDashboardUsersForShoreside: sql("getDashboardUsersForShoreside.sql"),
  getDashboardUsersForCaptain: sql("getDashboardUsersForCaptain.sql"),
  getDashboardUsersForCrew: sql("getDashboardUsersForCrew.sql"),
  getDashboardUsers: sql("getDashboardUsers.sql"),
};

export async function getDashboardUsers(req, res) {
  let { vessel_id } = req.query;

  console.log("vessel_id HERE", vessel_id);

  let vesselData = await db.one("SELECT * FROM vessels WHERE id = $1", [
    vessel_id,
  ]);
  // { vessel_name: 'Catch Me If You Can', id: 1 }
  let vesselProducts = await db.any(
    "SELECT * FROM vessels_products WHERE vessel_id = $1",
    [vesselData.id],
  );
  //[
  // { vessel_id: 1, product_id: 'hr' },
  // { vessel_id: 1, product_id: '3b' }
  // ]
  let dashboardUsers = await db.query(queries.getDashboardUsers, [vessel_id]);
  // [ {...userData}, {...userData} ]
  let usersWithProductProgressMaps = await Promise.all(
    dashboardUsers.map((dashUser) =>
      appendUserFullProductProgressMap(dashUser),
    ),
  );
  // [ {...userData, userFullProgressMap}, {...userData, userFullProgressMap} ]

  const vesselDashboardData = {
    vesselName: vesselData.name,
    vesselProducts,
    usersWithProductProgressMaps,
  };

  // if (level === "1" || level === "0") {
  //   let dashboardUsers = await db.any(queries.getDashboardUsersForShoreside, { id, company, });
  //   let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))

  //   res.status(200).json(usersWithTestData);
  // }
  // else if (level === "2") {
  //   let dashboardUsers = await db.any(queries.getDashboardUsersForCaptain, { id, vessel });
  //   let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))

  //   res.status(200).json(usersWithTestData);
  // }
  // else if (level === "3") {
  //   let dashboardUsers = await db.any(queries.getDashboardUsersForCrew, { id, vessel });
  //   let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))

  //   res.status(200).json(usersWithTestData);
  // }
  res.status(200).json(vesselDashboardData);
}
