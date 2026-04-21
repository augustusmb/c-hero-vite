import dotenv from 'dotenv';
dotenv.config();

const dbconfig = process.env.DB_LOCAL;
import pgPromise from 'pg-promise';
const pgp = pgPromise({});

const db = pgp(dbconfig);

db.query('DROP SCHEMA public cascade')
.then(() => {
  console.log('SUCCESS, tables dropped');
  pgp.end(); // to avoid delay exiting the process;
})
.catch((error) => {
  console.log('ERROR Here:', error);
  pgp.end(); // to avoid delay exiting the process;
});