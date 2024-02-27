import db from '../../db/db.js';
import path from 'path';

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, '/db/queries/classes/', file);
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