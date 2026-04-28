import dotenv from "dotenv";
import { publicRouter, protectedRouter } from "./routes.js";
import { errorHandler } from "./utils/errorHandler.js";
import cors from "cors";
import path from "path";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

dotenv.config();
const __dirname = path.resolve();

const app = express();
app.set("trust proxy", 1);

const client = jwksClient({
  jwksUri: `https://${process.env.VITE_AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 36e5,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authHeader.slice(7).trim();
  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
      audience: process.env.VITE_AUTH0_AUDIENCE,
      issuer: `https://${process.env.VITE_AUTH0_DOMAIN}/`,
    },
    (err, user) => {
      if (err) {
        console.error("[checkJwt]", err.message);
        return res.status(401).send(err.message);
      }
      req.user = user;
      next();
    },
  );
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

const corsOrigin =
  process.env.VITE_NODE_ENV === "local"
    ? "http://localhost:5173"
    : "https://c-herotraining.com";
app.use(cors({ origin: corsOrigin }));
const port = process.env.PORT || 8080;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.use("/api/public", publicRouter);
app.use("/api/routes", checkJwt, protectedRouter);

app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.use(errorHandler);

if (process.env.VITE_NODE_ENV === "production") {
  app.use(express.static("dist"));
}

app.use((req, res) => {
  const indexPath = path.join(__dirname, "/dist/index.html");
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log("listening on port: ", port);
});
