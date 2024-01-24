export async function signUpUser(req, res) {

  const { firstName, lastName, phone, email, company, port, vessel, title, rescuePole, mounts, rescueDavits } = req.body.data



  console.log('First name here: ', firstName + ' ' + lastName)

  res.status(200).json(req.query)

  // const productMap = {
  //   '45': '_45',
  //   '47': '_47',
  //   '44s': '_44s',
  //   '44fp': '_44fp',
  //   '46': '_46',
  //   '62s': '_62s',
  //   '62fp': '_62fp'
  // }

  
  // const limit = pLimit(4)

  // let userProducts = products.map(product => [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`])

  // userProducts = userProducts.flat()

  // console.log('USER PRODUCTS HERE: ', userProducts)
  
  // let promises = userProducts.map(product_id => limit(() => db.query(queries.insertUsersProducts, { product_id, user_id })))

  // let insertedUserProducts = await Promise.all(promises)




  // products.forEach(product => {
  //   let productsToInsert = [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`]
  //   productsToInsert.forEach(product_id => {
      

  //     db.query(queries.insertUsersProducts, { product_id, user_id })
  //     .catch(err => {
  //       console.log('Error inserting new user - product in join table: ', err)
  //     })
  //   })
  // })
}