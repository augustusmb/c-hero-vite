import path from "path";
import db from "../../db/db.js";

const QueryFile = db.$config.pgp.QueryFile;
const projectRoot = path.resolve();

export const createSqlLoader = (domain) => (file) => {
  const fullPath = path.join(projectRoot, "db/queries", domain, file);
  return new QueryFile(fullPath, { minify: true });
};
