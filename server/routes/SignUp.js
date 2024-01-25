import db from '../../db/db.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config()

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(
  'all',
  process.cwd()
);

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();
const environment = env.VITE_NODE_ENV


const sql = (file) => {
  let fullPath = path.join(__dirname, '../db/queries/users/', file)
  
  if (environment === 'production') {
    fullPath = path.join(__dirname, '/db/queries/users/', file);
  }
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  insertUser: sql('insertUser.sql'),
};

export async function signUpUser(req, res) {

  const { firstName, lastName, phone, email, company, port, vessel, title, rescuePole, mounts, rescueDavits } = req.body.data
  const name = `${firstName} ${lastName}`
  let level = null

  console.log('Look Here, length is: ', firstName.length)

  switch (title) {
    case 'Captain':
      level = '1'
    break;
    case 'Shoreside':
      level = '2'
      break;
    case 'Crew':
      level = '1'
    break;
    default:
      console.log('Unknown fruit');
  }
  // insert user into users table
  // const user_id = await db.query(queries.insertUser, { name, phone, email, company, port, vessel, title, level })


  // const limit = pLimit(4)

  // let userProducts = products.map(product => [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`])
  // userProducts = userProducts.flat()

  
  // let promises = userProducts.map(product_id => limit(() => db.query(queries.insertUsersProducts, { product_id, user_id })))
  // let insertedUserProducts = await Promise.all(promises)

}