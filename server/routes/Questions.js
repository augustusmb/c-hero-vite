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

const sql = (file) => {
  let fullPath = path.join(__dirname, '../db/queries/questions/', file)

  if (environment === 'production') {
    fullPath = path.join(__dirname, '/db/queries/questions/', file);
  }
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getQuestions: sql('getQuestions.sql')
};

export const getQuestions = async (req, res) => {
  const { classId } = req.query
  let result = await db.any(queries.getQuestions, { classId })
  res.status(200).json(result)
}
