import db from "../../db/db.js";
import informAssessmentResult from "../sms.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sql = createSqlLoader("submitAssessment");

const queries = {
  submitAssessment: sql("submitAssessment.sql"),
};

export const submitAssessment = asyncHandler(async (req, res) => {
  const { questionsMissed, last_name, first_name, phone, userId, classId } =
    req.body.params.completedAssessmentData;

  informAssessmentResult(
    questionsMissed,
    first_name,
    last_name,
    phone,
    classId,
  );

  const passed = questionsMissed.length === 0;
  if (!passed) {
    return res.status(200).json({ success: true, passed: false });
  }

  await db.query(queries.submitAssessment, { userId, classId });
  res.status(200).json({ success: true, passed: true });
});
