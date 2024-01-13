import db from '../../db/db.js';
import path from 'path';
// import pLimit from 'p-limit';
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
  addQuestion: sql('addQuestion.sql'),
  getQuestions: sql('getQuestions.sql')
};

export const getQuestions = async (req, res) => {
  const { classId } = req.query
  let result = await db.any(queries.getQuestions, { classId })
  res.status(200).json(result)
}

export const addQuestion = (req) => {
  const { Title, TrueOrFalse, CorrectAnswer, WrongAnswer1, WrongAnswer2, WrongAnswer3, _44A, _44B, _44C, _44D, _45A, _45B, _45C, _45D, _47A, _47B, _47C, _47D, _62A, _62B, _62C, _62D } = req.body.questionData
  db.none(queries.addQuestion, { Title, TrueOrFalse, CorrectAnswer, WrongAnswer1, WrongAnswer2, WrongAnswer3, _44A, _44B, _44C, _44D, _45A, _45B, _45C, _45D, _47A, _47B, _47C, _47D, _62A, _62B, _62C, _62D })
  .then(() => console.log('Success adding test question'))
  .catch(err => console.log('Error: ', err))
}


// const limit = pLimit(10)


export const addQuestionOnce = (items) => {
  items.forEach(item => {
    const { id, title, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, true_or_false } = item
    db.none(queries.addQuestion, { id, title, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, true_or_false })
    .then(() => console.log('Success adding test question'))
    .catch(err => console.log('Error: ', err))
  })
}

// const addQuestionPLimit = async () => {
//   let promises = questions.map(({ id, title, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, true_or_false}) => limit(() => db.none(queries.addQuestion, { id, title, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, true_or_false })))
  
//   let insertedQuestionPromises = await Promise.all(promises)

// }

// addQuestionPLimit()
