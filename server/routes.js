import express from "express";
import { getQuestions } from "./routes/Questions.js";
import {
  getUserByPhone,
  updateUserInfo,
  deleteUser,
  acceptTermsAndConditions,
  fetchAllUsers,
  updateUserInfoAndProducts,
} from "./routes/Users.js";
import { submitTest } from "./routes/SubmitTest.js";
import { getUsersAssignedClasses } from "./routes/Classes.js";
import { getDashboardUsers } from "./routes/Dashboard.js";
import { fetchFormOptions, signUpUserNew } from "./routes/SignUp.js";
import {
  getSerialNumbers,
  addSerialNumber,
  deleteSerialNumber,
} from "./routes/Products.js";

export const publicRouter = express.Router();
export const protectedRouter = express.Router();

// router.route("/").post(signUpUser);

publicRouter.get("/", fetchFormOptions);
publicRouter.post("/", signUpUserNew);

protectedRouter.route("/questions").get(getQuestions);

protectedRouter
  .route("/users")
  .get(getUserByPhone)
  .put(updateUserInfo)
  .delete(deleteUser);

protectedRouter.route("/fetch-all-users").get(fetchAllUsers);

protectedRouter.route("/users-products").put(updateUserInfoAndProducts);

protectedRouter.route("/users/terms").put(acceptTermsAndConditions);

protectedRouter.route("/submit-test").post(submitTest);

protectedRouter.route("/classes").get(getUsersAssignedClasses);

protectedRouter.route("/dashboard").get(getDashboardUsers);

protectedRouter
  .route("/product-serial-numbers")
  .get(getSerialNumbers)
  .post(addSerialNumber)
  .delete(deleteSerialNumber);
