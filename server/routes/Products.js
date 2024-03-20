import db from '../../db/db.js';
import path from 'path';

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, '/db/queries/products/', file);
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  getSerialNumbers: sql('getSerialNumbers.sql'),
  deleteSerialNumber: sql('deleteSerialNumber.sql'),
  addSerialNumber: sql('addSerialNumber.sql')
};

export function getSerialNumbers(req, res) {
  const { userId } = req.query

  db.query(queries.getSerialNumbers, { userId })
  .then(data => {
    res.status(200).json(data)
  })
  .catch(err => console.log('Error retrieving user\'s product serial numbers', err))
}

export function deleteSerialNumber(req, res) {
  const { userId, serialNumber } = req.query

  db.none(queries.deleteSerialNumber, { userId, serialNumber })
  .then(() => {
    res.status(200).json('Serial number of product deleted for user')
  })
  .catch(err => console.log('Error deleting serial number of product for user', err))
}

export function addSerialNumber(req, res) {
  const { userId, serialNumber } = req.body

  db.none(queries.addSerialNumber, { userId, serialNumber })
  .then(() => {
    res.status(200).json('Serial number added for user')
  })
  .catch(err => console.log('Error adding serial number for user', err))
}