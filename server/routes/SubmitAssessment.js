import db from "../../db/db.js";
import informAssessmentResult from "../sms.js";
import { createSqlLoader } from "../utils/sqlLoader.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPredecessorClassId } from "../utils/utilFunctions.js";

const sql = createSqlLoader("submitAssessment");

const queries = {
  submitAssessment: sql("submitAssessment.sql"),
};

const ensurePredecessorComplete = async (userId, classId) => {
  const predecessorId = getPredecessorClassId(classId);
  if (!predecessorId) return { ok: true };

  const user = await db.oneOrNone(
    "SELECT is_admin FROM users WHERE id = $1",
    [userId],
  );
  if (user?.is_admin) return { ok: true };

  const predecessor = await db.oneOrNone(
    "SELECT completed FROM users_products WHERE user_id = $1 AND class_id = $2",
    [userId, predecessorId],
  );
  if (!predecessor) return { ok: true };
  if (!predecessor.completed) {
    return { ok: false, predecessorId };
  }
  return { ok: true };
};

export const submitAssessment = asyncHandler(async (req, res) => {
  const { questionsMissed, last_name, first_name, phone, userId, classId } =
    req.body.params.completedAssessmentData;

  const gate = await ensurePredecessorComplete(userId, classId);
  if (!gate.ok) {
    return res.status(403).json({
      error: `Complete ${gate.predecessorId} before submitting ${classId}.`,
      predecessorId: gate.predecessorId,
    });
  }

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
