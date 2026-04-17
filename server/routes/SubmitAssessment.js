import db from "../../db/db.js";
import path from "path";
import informAssessmentResult from "../sms.js";

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();

const sql = (file) => {
  const fullPath = path.join(__dirname, "/db/queries/submitAssessment/", file);
  return new QueryFile(fullPath, { minify: true });
};

const queries = {
  submitAssessment: sql("submitAssessment.sql"),
};

export function submitAssessment(req, res) {
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

  db.query(queries.submitAssessment, { userId, classId })
    .then(() => {
      console.log("Assessment SUBMITTED");
      res.status(200).json({ success: true, passed: true });
    })
    .catch((err) => {
      console.error("Error submitting completed assessment:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to record assessment result" });
    });
}
