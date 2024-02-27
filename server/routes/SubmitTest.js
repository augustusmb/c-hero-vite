import db from '../../db/db.js';
import path from 'path';
import informTestResult from '../sms.js'
// import dotenv from 'dotenv';

// import { defineConfig, loadEnv } from 'vite';
// dotenv.config()

// const env = loadEnv(
//   'all',
//   process.cwd()
// );

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();
// const environment = env.VITE_NODE_ENV

// const sql = (file) => {
//   let fullPath = path.join(__dirname, '/db/queries/submitTest/', file)

//   if (environment === 'production') {
//     fullPath = path.join(__dirname, '/db/queries/submitTest/', file);
//   }
//   return new QueryFile(fullPath, {minify: true});
// }

const sql = (file) => {
  const fullPath = path.join(__dirname, '/db/queries/submitTest/', file);
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  submitTest: sql('submitTest.sql')
};

export function submitTest(req, res) {
  const { questionsMissed, name, phone, userId, classId } = req.body.params.completedTestData
  informTestResult(questionsMissed, name, phone, classId)
  
  if (questionsMissed.length === 0) {
    db.query(queries.submitTest, { userId, classId })
    .then(data => {
      console.log('Test SUBMITTED')
      res.status(200).json(data)
    })
    .catch(err => console.log('Error submitting completed test: ', err))
  }
}