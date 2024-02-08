import dotenv from 'dotenv';
import router from './routes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

dotenv.config()
const __dirname = path.resolve();

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(
  'all',
  process.cwd()
);

const app = express()

const client = jwksClient({
  jwksUri: `https://${env.VITE_AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, user) => {
      if (err) {
        console.log('err: ', err)
        return res.status(403).send(err.message);
      }

      req.user = user;
      next();
    });
  } else {
    console.log(`No auth header`)
    return res.sendStatus(401);
  }
};

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOrigin = env.VITE_NODE_ENV === 'local' ? 'http://localhost:5173/' : 'https://c-herotraining.com/'
app.use(cors({ origin: corsOrigin }));
const port = env.PORT || 8080

app.use('/api/routes/sign-up', router)
app.use('/api/routes', checkJwt, router)

if (env.VITE_NODE_ENV === "production") {
  app.use(express.static("dist"));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use((req, res) => {
  const indexPath = path.join(__dirname, '/dist/index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log('listening on port: ', port)
})