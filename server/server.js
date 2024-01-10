import dotenv from 'dotenv';
import router from './routes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';
// import jwt from 'jsonwebtoken';
dotenv.config()
const __dirname = path.resolve();

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(
  'all',
  process.cwd()
);

const app = express()

const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.VITE_AUTH0_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));
const port = env.PORT || 8080

app.use('/api/routes', checkJwt, router)

if (env.VITE_NODE_ENV === "production") {
  app.use(express.static("dist"));
}

app.get('/', (req, res) => {
  console.log("Hello")
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log('listening on port: ', port)
})