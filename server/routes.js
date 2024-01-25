import express from 'express'
import { getQuestions } from './routes/Questions.js'
import { addMobOfficer } from './routes/MobOfficers.js'
import { getUserByPhone, updateUserInfo, deleteUser, acceptTermsAndConditions, fetchAllUsers } from './routes/Users.js'
import { addCustomer } from './routes/Customers.js'
import { submitTest } from './routes/SubmitTest.js'
import { getUsersAssignedClasses } from './routes/Classes.js'
import { getCompanies, getCompanyByName, insertCompany } from './routes/Company.js';
import { getPorts } from './routes/Ports.js';
import { getVessels } from './routes/Vessels.js';
import { getDashboardUsers } from './routes/Dashboard.js';
import { updateUserInfoAndProducts } from './routes/Users.js'
import { signUpUser } from './routes/SignUp.js'


const router = express.Router()

router.route('/sign-up')
  .post(signUpUser)
  
router.route('/questions')
  .get(getQuestions)

router.route('/mobOfficers')
  .post(addMobOfficer)

router.route('/companies')
  .get(getCompanies)

router.route('/company')
  .get(getCompanyByName)
  .post(insertCompany)
  
router.route('/ports')
  .get(getPorts)

router.route('/vessels')
  .get(getVessels)

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

router.route('/customers')
  .get(addCustomer)

router.route('/submit-test')
  .post(submitTest)

router.route('/classes')
  .get(getUsersAssignedClasses)

router.route('/dashboard')
  .get(getDashboardUsers)

export default router