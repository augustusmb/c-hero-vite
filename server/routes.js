import express from "express";
import { getQuestions } from "./routes/Questions.js";
import {
  listQuestions as listAdminQuestions,
  createQuestion as createAdminQuestion,
  updateQuestion as updateAdminQuestion,
  deleteQuestion as deleteAdminQuestion,
} from "./routes/AdminQuestions.js";
import {
  getUserByPhone,
  updateUserInfo,
  deleteUser,
  acceptTermsAndConditions,
  fetchAllUsers,
  updateUserInfoAndProducts,
} from "./routes/Users.js";
import { submitAssessment } from "./routes/SubmitAssessment.js";
import { getUsersAssignedClasses } from "./routes/Classes.js";
import { getDashboardUsers } from "./routes/Dashboard.js";
import {
  fetchFormOptions,
  signUpUserNew,
  checkPhoneAvailable,
} from "./routes/SignUp.js";
import {
  listProducts,
  getSerialNumbers,
  addSerialNumber,
  deleteSerialNumber,
} from "./routes/Products.js";

export const publicRouter = express.Router();
export const protectedRouter = express.Router();

// router.route("/").post(signUpUser);

publicRouter.get("/sign-up", fetchFormOptions);
publicRouter.post("/sign-up", signUpUserNew);
publicRouter.get("/sign-up/phone-available", checkPhoneAvailable);
publicRouter.get("/products", listProducts);

protectedRouter.route("/questions").get(getQuestions);

protectedRouter
  .route("/admin/questions")
  .get(listAdminQuestions)
  .post(createAdminQuestion);

protectedRouter
  .route("/admin/questions/:id")
  .put(updateAdminQuestion)
  .delete(deleteAdminQuestion);

protectedRouter
  .route("/users")
  .get(getUserByPhone)
  .put(updateUserInfo)
  .delete(deleteUser);

protectedRouter.route("/fetch-all-users").get(fetchAllUsers);

protectedRouter.route("/users-products").put(updateUserInfoAndProducts);

protectedRouter.route("/users/terms").put(acceptTermsAndConditions);

protectedRouter.route("/submit-assessment").post(submitAssessment);

protectedRouter.route("/classes").get(getUsersAssignedClasses);

protectedRouter.route("/dashboard").get(getDashboardUsers);

protectedRouter
  .route("/product-serial-numbers")
  .get(getSerialNumbers)
  .post(addSerialNumber)
  .delete(deleteSerialNumber);
