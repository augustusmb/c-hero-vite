import db from '../../db/db.js';
import path from 'path';
import dotenv from 'dotenv';
import { signUpMessage } from '../sms.js';
import pLimit from 'p-limit';
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
  getUserByPhone: sql('getUserByPhone.sql'),
  fetchAllUsers: sql('fetchAllUsers.sql'),
  updateUserInfo: sql('updateUserInfo.sql'),
  deleteUser: sql('deleteUser.sql'),
  insertUser: sql('insertUser.sql'),
  insertUsersProducts: sql('insertUsersProducts.sql'),
  acceptTermsAndConditions: sql('acceptTermsAndConditions.sql'),
  deleteUserSpecificClasses: sql('deleteUserSpecificClasses.sql')
};

export function getUserByPhone(req, res) {
  const { phone } = req.query
  console.log('Server Hit Here: ', phone)
  db.query(queries.getUserByPhone, { phone })
  .then(data => {
    res.status(200).json(data)
  })
  .catch(err => console.log('Error requesting account info: ', err))
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

export async function insertUser(req) {
  console.log(`Congrats, you've reached the point of entering a new user.`)
  console.log('New User Data: ', req.body.data)
  const name = req.body.data['field:comp-kx6gm8r4'] + ' ' + req.body.data['field:comp-kx6gm8rc']
  const phone = '+1' + req.body.data['field:comp-kx6gup5p'].replace(/\D/g,'')
  const email = req.body.data['contact.Email[0]']
  const company = req.body.data['field:comp-kx6gug04']
  const port = req.body.data['field:comp-kx6gvt2u']
  const vessel = req.body.data['field:comp-kx6gwut4']
  const title = req.body.data['field:comp-kx6gm8rk']
  const level = title === 'Shoreside' ? 1 : title === 'Captain' ? 2 : 3
  const products = req.body.data['field:comp-kx6gm8rp'].split(', ')
  console.log('True False Here: ', products)
  console.log('Type of is: ', typeof products)
  console.log('Length is: ', products.length)
  let user_id
  signUpMessage(phone)

  const productMap = {
    '45': '_45',
    '47': '_47',
    '44s': '_44s',
    '44fp': '_44fp',
    '46': '_46',
    '62s': '_62s',
    '62fp': '_62fp'
  }

  const userId = await db.query(queries.insertUser, { name, phone, email, company, port, vessel, title, level })
  console.log('New Stuff Here: ' + userId)
  user_id = userId[0].id
  console.log('Alpha ' + userId[0].id)
  console.log('Bravo ' + user_id)
  // .then(data => {
  //   console.log('Success entering NEW USER into database')
  //   console.log('RETURN DATA HERE ', data)
  //   user_id = parseInt(data[0].id)
  //   res.status(200).json(data)
  // })
  // .catch(err => console.log('Error inserting new user: ', err))

  // [ '45', '47', '46' ]
  
  const limit = pLimit(4)

  let userProducts = products.map(product => [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`])

  userProducts = userProducts.flat()

  console.log('USER PRODUCTS HERE: ', userProducts)
  
  let promises = userProducts.map(product_id => limit(() => db.query(queries.insertUsersProducts, { product_id, user_id })))

  let insertedUserProducts = await Promise.all(promises)

  console.log('YO YO YO')
  console.log('Inserted User Products: ', insertedUserProducts)



  // products.forEach(product => {
  //   let productsToInsert = [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`]
  //   productsToInsert.forEach(product_id => {
      

  //     db.query(queries.insertUsersProducts, { product_id, user_id })
  //     .catch(err => {
  //       console.log('Error inserting new user - product in join table: ', err)
  //     })
  //   })
  // })
}