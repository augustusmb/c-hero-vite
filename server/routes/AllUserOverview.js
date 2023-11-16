import db from "../../db/db.js";
import path from "path";
// import pLimit from 'p-limit';

import dotenv from 'dotenv';

import { defineConfig, loadEnv } from 'vite';
dotenv.config()

const env = loadEnv(
  'all',
  process.cwd()
);

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();
const environment = env.VITE_NODE_ENV;

const sql = (file) => {
  let fullPath = path.join(__dirname, "../db/queries/allUserOverview/", file);

  if (environment === "production") {
    fullPath = path.join(__dirname, "/db/queries/allUserOverview/", file);
  }
  return new QueryFile(fullPath, { minify: true });
};

const queries = {
  getAllUserData: sql("getAllUserData.sql"),
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

/*
export async function getAllUserData(req, res) {

  const limit = pLimit(20)
  let allUserData = await db.any(queries.getAllUserData);

  let promises = allUserData.map(userData => limit(() => getUserTestData(userData)))

  let usersWithTestData = await Promise.all(promises)

  // while (allUserData.length) {
  //   await Promise.all(allUserData.splice(0, 15).map(userData => getUserTestData(userData)))

    // let usersWithTestData = await Promise.all(allUserData.map(userData => getUserTestData(userData)))
  // }
  
  res.status(200).json(usersWithTestData);

}
*/
