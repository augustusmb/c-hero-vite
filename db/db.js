import dotenv from 'dotenv'
import pgPromise from 'pg-promise';
import { defineConfig, loadEnv } from 'vite';
dotenv.config()

const env = loadEnv(
  'all',
  process.cwd()
);
  
  const pgp = pgPromise({});

const connectionString = env.VITE_DATABASE_URL;
if (!connectionString) {
  throw new Error('VITE_DATABASE_URL is not set. Check your .env file.');
}
const isLocal = connectionString.includes('localhost');

const config = {
    connectionString,
    max: 30,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  }


export default pgp(config)