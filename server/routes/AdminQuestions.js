import db from "../../db/db.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("adminQuestions");

const queries = {
  listQuestionsWithClasses: sql("listQuestionsWithClasses.sql"),
  insertQuestion: sql("insertQuestion.sql"),
  updateQuestion: sql("updateQuestion.sql"),
  deleteQuestion: sql("deleteQuestion.sql"),
  insertClassQuestionLink: sql("insertClassQuestionLink.sql"),
  deleteAllClassLinksForQuestion: sql("deleteAllClassLinksForQuestion.sql"),
};

const extractQuestionFields = (body) => ({
  title: body.title,
  true_or_false: body.true_or_false,
  correct_answer: body.correct_answer,
  incorrect_answer1: body.incorrect_answer1 ?? "",
  incorrect_answer2: body.incorrect_answer2 ?? "",
  incorrect_answer3: body.incorrect_answer3 ?? "",
});

export const listQuestions = asyncHandler(async (_req, res) => {
  const result = await db.any(queries.listQuestionsWithClasses);
  res.status(200).json(result);
});

export const createQuestion = asyncHandler(async (req, res) => {
  const fields = extractQuestionFields(req.body);
  const class_ids = Array.isArray(req.body.class_ids) ? req.body.class_ids : [];

  const newId = await db.tx(async (t) => {
    const { id } = await t.one(queries.insertQuestion, fields);
    await Promise.all(
      class_ids.map((class_id) =>
        t.none(queries.insertClassQuestionLink, { question_id: id, class_id }),
      ),
    );
    return id;
  });

  res.status(201).json({ id: newId, ...fields, class_ids });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const fields = extractQuestionFields(req.body);
  const class_ids = Array.isArray(req.body.class_ids) ? req.body.class_ids : [];

  await db.tx(async (t) => {
    await t.none(queries.updateQuestion, { id, ...fields });
    await t.none(queries.deleteAllClassLinksForQuestion, { question_id: id });
    await Promise.all(
      class_ids.map((class_id) =>
        t.none(queries.insertClassQuestionLink, { question_id: id, class_id }),
      ),
    );
  });

  res.status(200).json({ id, ...fields, class_ids });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  await db.tx(async (t) => {
    await t.none(queries.deleteAllClassLinksForQuestion, { question_id: id });
    await t.none(queries.deleteQuestion, { id });
  });

  res.status(200).json({ success: true });
});
