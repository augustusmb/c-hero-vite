import db from '../../db/db.js';
import path from 'path';
import dotenv from 'dotenv';

import { defineConfig, loadEnv } from 'vite';
dotenv.config()

const env = loadEnv(
  'all',
  process.cwd()
);

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();
const environment = env.VITE_NODE_ENV

console.log('ENVIRONMENT HERE: ', environment)

const sql = (file) => {
  let fullPath = path.join(__dirname, '../db/queries/classes/', file);

  if (environment === 'production') {
    fullPath = path.join(__dirname, '/db/queries/classes/', file);
  }
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getUsersAssignedClasses: sql('getUsersAssignedClasses.sql')
};

export function getUsersAssignedClasses(req, res) {
  const { userId } = req.query

  db.query(queries.getUsersAssignedClasses, { userId })
  .then(data => {
    res.status(200).json(data)
  })
  .catch(err => console.log('Error retrieving user\'s classes', err))
}