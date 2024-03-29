import express from 'express'
import { getQuestions } from './routes/Questions.js'
import { getUserByPhone, updateUserInfo, deleteUser, acceptTermsAndConditions, fetchAllUsers, updateUserInfoAndProducts } from './routes/Users.js'
import { submitTest } from './routes/SubmitTest.js'
import { getUsersAssignedClasses } from './routes/Classes.js'
import { getDashboardUsers } from './routes/Dashboard.js';
import { signUpUser } from './routes/SignUp.js'
import { getSerialNumbers, addSerialNumber, deleteSerialNumber } from './routes/Products.js'


const router = express.Router()

router.route('/')
  .post(signUpUser)

router.route('/questions')
  .get(getQuestions)

router.route('/users')
  .get(getUserByPhone)
  .put(updateUserInfo)
  .delete(deleteUser)

router.route('/fetch-all-users')
  .get(fetchAllUsers)

router.route('/users-products')
  .put(updateUserInfoAndProducts)

router.route('/users/terms')
  .put(acceptTermsAndConditions)

router.route('/submit-test')
  .post(submitTest)

router.route('/classes')
  .get(getUsersAssignedClasses)

router.route('/dashboard')
  .get(getDashboardUsers)

router.route('/product-serial-numbers')
  .get(getSerialNumbers)
  .post(addSerialNumber)
  .delete(deleteSerialNumber)

export default router