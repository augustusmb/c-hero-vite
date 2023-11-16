import dotenv from 'dotenv';
import router from './routes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';
dotenv.config()
const __dirname = path.resolve();

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(
  'all',
  process.cwd()
);

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));
const port = env.PORT || 8080

app.use('/api/routes', router)

if (env.VITE_NODE_ENV === "production") {
  app.use(express.static("../dist"));
}

app.get('/', (req, res) => {
  console.log("Hello")
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log('listening on port: ', port)
})