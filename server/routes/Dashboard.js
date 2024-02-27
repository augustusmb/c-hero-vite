import db from "../../db/db.js";
import path from "path";

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, '/db/queries/dashboard/', file);
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getDashboardUsersForShoreside: sql("getDashboardUsersForShoreside.sql"),
  getDashboardUsersForCaptain: sql("getDashboardUsersForCaptain.sql"),
  getDashboardUsersForCrew: sql("getDashboardUsersForCrew.sql")
};

async function getUserTestData(user) {
  let userTestData = await db.any(
    `select * from users_products where user_id = ${user.id}`
  );
  user.totalTests = userTestData.length;
  user.testsCompleted = userTestData.reduce((acc, test) => {
    let numToAdd = test.completed ? 1 : 0;
    return acc + numToAdd;
  }, 0);

  return user;
}

export async function getDashboardUsers(req, res) {
  let { id, company, vessel, level } = req.query;

  if (level === "1" || level === "0") {
    let dashboardUsers = await db.any(queries.getDashboardUsersForShoreside, { id, company, });
    let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))

    res.status(200).json(usersWithTestData);
  }
  else if (level === "2") {
    let dashboardUsers = await db.any(queries.getDashboardUsersForCaptain, { id, vessel });
    let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))
    
    res.status(200).json(usersWithTestData);
  }
  else if (level === "3") {
    let dashboardUsers = await db.any(queries.getDashboardUsersForCrew, { id, vessel });
    let usersWithTestData = await Promise.all(dashboardUsers.map(dashUser => getUserTestData(dashUser)))
    
    res.status(200).json(usersWithTestData);
  }
}
