import dotenv from "dotenv";
import pgPromise from "pg-promise";

dotenv.config();

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}
const isLocal = connectionString.includes("localhost");

const config = {
  connectionString,
  max: 30,
  ssl: isLocal ? false : { rejectUnauthorized: false },
};

export default pgp(config);
