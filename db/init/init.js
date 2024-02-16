import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import pgPromise from 'pg-promise';
const pgp = pgPromise({});

const db = pgp(import.meta.env.VITE_DB_LOCAL);
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, './tables', file);
  return new pgp.QueryFile(fullPath, { minify: true });
};

const queries = {
  products: sql('products.sql'),
  users: sql('users.sql'),
  questions: sql('questions.sql'),
  products_questions: sql('products_questions.sql'),
  users_products: sql('users_products.sql'),
  users_vessels: sql('users_vessels.sql'),
  vessels_products: sql('vessels_products.sql'),
};

db.tx((t) => {
  return t.batch(Object.keys(queries).map(k => t.none(queries[k])));
})
.then(() => {
  console.log('SUCCESS');
  pgp.end(); // to avoid delay exiting the process;
})
.catch((error) => {
  console.log('ERROR Here:', error);
  pgp.end(); // to avoid delay exiting the process;
});
