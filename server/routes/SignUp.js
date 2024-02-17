import db from '../../db/db.js';
import path from 'path';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
dotenv.config()

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(
  'all',
  process.cwd()
);

const QueryFile = db.$config.pgp.QueryFile;
const __dirname = path.resolve();
const environment = env.VITE_NODE_ENV


const sql = (file) => {
  let fullPath = path.join(__dirname, '../db/queries/users/', file)
  
  if (environment === 'production') {
    fullPath = path.join(__dirname, '/db/queries/users/', file);
  }
  return new QueryFile(fullPath, {minify: true});
}

const queries = {
  insertUser: sql('insertUser.sql'),
  insertUsersProducts: sql('insertUsersProducts.sql'),
};

export async function signUpUser(req, res) {
  console.log(`You've made it into user sign up`)
  console.log('Data: ', req.body.data)

  const data = req.body.data;
  const trimmedData = Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
  
  const { firstName, lastName, phone, email, company, port, vessel, title, rescuePole, mount, rescueDavit } = trimmedData;

  const name = `${firstName} ${lastName}`
  let level = null

  switch (title) {
    case 'Captain':
      level = '1'
    break;
    case 'Shoreside':
      level = '2'
      break;
    case 'Crew':
      level = '1'
    break;
    default:
      console.log('Unknown fruit');
  }

  try {
    const [{ id: user_id }] = await db.query(queries.insertUser, { name, phone, email, company, port, vessel, title, level });



    const usersProducts = []

    if (checkValidDavitAndMount(rescueDavit, mount)) {
      const davitType = rescueDavit[7]
      const mountType = mount.includes('flat') ? 'f' : 'b'
      const davitCode = `${davitType}${mountType}`
      usersProducts.push(davitCode)
    }

    if (checkValidRescuePole(rescuePole)) {
      const rescuePoleCode = rescuePole.slice(0, 2).toLowerCase()
      usersProducts.push(rescuePoleCode)
    }

    const usersClasses = usersProducts.flatMap(product => [`${product}_a`, `${product}_b`, `${product}_c`,`${product}_d`]);
  
    const limit = pLimit(4);
  
    let promises = usersClasses.map(product_id => limit(() => db.query(queries.insertUsersProducts, { product_id, user_id })));
    await Promise.all(promises);
  
    res.status(200).json('success inserting user and assigning products');
  } catch (error) {
    console.error(error);
    res.status(500).json('error inserting user and assigning products, check if duplicate phone exists in the database.');
  }
}


function checkValidRescuePole(rescuePole) {
  const validRescuePoles = ['RK', 'VR14', 'RS14', 'HR14'];
  return validRescuePoles.includes(rescuePole);
}

function checkValidDavitAndMount(rescueDavit, mount) {
  const validDavitMounts = ['Tugboat Bitt Mount', 'Side of Boat Flat Mount'];
  const validRescueDavits = ['Series 3 Fixed Davit', 'Series 5 Hinged Davit', 'Series 7 Swivel Davit', 'Series 9 Man Rated'];
  return validDavitMounts.includes(mount) && validRescueDavits.includes(rescueDavit);
}