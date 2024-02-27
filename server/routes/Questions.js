import db from '../../db/db.js';
import path from 'path';

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, '/db/queries/questions/', file);
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
