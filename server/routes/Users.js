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
  let fullPath = path.join(__dirname, '/db/queries/users/', file)

  if (environment === 'production') {
    fullPath = path.join(__dirname, '/db/queries/users/', file);
  }
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getUserByPhone: sql('getUserByPhone.sql'),
  fetchAllUsers: sql('fetchAllUsers.sql'),
  updateUserInfo: sql('updateUserInfo.sql'),
  deleteUser: sql('deleteUser.sql'),
  acceptTermsAndConditions: sql('acceptTermsAndConditions.sql'),
  deleteUserSpecificClasses: sql('deleteUserSpecificClasses.sql')
};

export async function getUserByPhone(req, res) {
  const { phone } = req.query
  const result = await db.query(queries.getUserByPhone, { phone })
  res.status(200).json(result);
}

export async function fetchAllUsers(req, res) {
  let allUserData = await db.any(queries.fetchAllUsers);
  res.status(200).json(allUserData);
}

export function deleteUser(req, res) {
  console.log('Deleting user in server with id: ', req.query.userId)
  const { userId } = req.query
  db.query(queries.deleteUser, { userId })
  .then(data => {
    res.send(data)
  })
  .catch(err => console.log('Error deleting user: ', err))
}

export async function updateUserInfo(req, res) {
  const { id, name, email, title, company, vessel, port } = req.body.params


  await Promise.all([
    db.none(queries.updateUserInfo, { id, name, email, title, company, vessel, port })
  ])
  .then(() => {
    console.log('All SQL commands executed');
    res.status(200).json({ message: 'User info updated successfully' });
  })
  .catch(err => {
    console.log('Error updating user products: ', err);
    res.status(500).json({ message: 'Error updating user info' });
  });
}

export async function updateUserInfoAndProducts(req, res) {
  const { id, name, email, title, company, vessel, port, newlyAddedProducts, newlyRemovedProducts } = req.body.params

  let insertQuery = updateUserProducts(Object.keys(newlyAddedProducts), id, newlyAddedProducts)
  let deleteQuery = deleteUserSpecificClasses(Object.keys(newlyRemovedProducts), id)

  await Promise.all([
    db.none(insertQuery),
    db.none(deleteQuery),
    db.none(queries.updateUserInfo, { id, name, email, title, company, vessel, port })
  ])
  .then(() => {
    console.log('All SQL commands executed');
    res.status(200).json({ message: 'User info updated successfully' });
  })
  .catch(err => {
    console.log('Error updating user products: ', err);
    res.status(500).json({ message: 'Error updating user info' });
  });
}

function updateUserProducts(products, user_id) {
  if (products.length === 0) return '-- This is a comment'

  let classes = []
  products.forEach(product => {
    classes.push([`${product}_a`, `${product}_b`, `${product}_c`,`${product}_d`])
  })
  classes = classes.flat()

  let values = classes.map((product_id) => `('${product_id}', '${user_id}')`);
  let valuesPart = values.join(", ");
  let insertStatement = `INSERT INTO users_products (product_id, user_id) VALUES ${valuesPart}`;
  return insertStatement
}

function deleteUserSpecificClasses(products, user_id) {
  if (products.length === 0) return '-- This is a comment'

  let classes = []
  products.forEach(product => {
    classes.push([`${product}_a`, `${product}_b`, `${product}_c`,`${product}_d`])
  })
  classes = classes.flat()

  let productIds = classes.map(id => `'${id}'`).join(", ");
  let deleteStatement = `DELETE FROM users_products WHERE product_id IN (${productIds}) AND user_id = ${user_id}`;
  return deleteStatement
}

export function acceptTermsAndConditions(req, res) {
  const { userId } = req.body.params

  db.query(queries.acceptTermsAndConditions, { userId })
  .then(data => {
    console.log("User terms and conditions updated successfully")
    res.status(200).json(data)
  })
  .catch(err => console.log('Error updating user accepting terms and conditions: ', err))
}