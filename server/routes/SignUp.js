export async function signUpUser(req, res) {

  const { firstName, lastName, phone, email, company, port, vessel, title, rescuePole, mounts, rescueDavits } = req.body.data



  console.log('First name here: ', firstName)

  res.status(200).json(req.query)

  // console.log(`Congrats, you've reached the point of entering a new user.`)
  // console.log('New User Data: ', req.body.data)
  // const name = req.body.data['field:comp-kx6gm8r4'] + ' ' + req.body.data['field:comp-kx6gm8rc']
  // const phone = '+1' + req.body.data['field:comp-kx6gup5p'].replace(/\D/g,'')
  // const email = req.body.data['contact.Email[0]']
  // const company = req.body.data['field:comp-kx6gug04']
  // const port = req.body.data['field:comp-kx6gvt2u']
  // const vessel = req.body.data['field:comp-kx6gwut4']
  // const title = req.body.data['field:comp-kx6gm8rk']
  // const level = title === 'Shoreside' ? 1 : title === 'Captain' ? 2 : 3
  // const products = req.body.data['field:comp-kx6gm8rp'].split(', ')
  // console.log('True False Here: ', products)
  // console.log('Type of is: ', typeof products)
  // console.log('Length is: ', products.length)
  // let user_id
  // signUpMessage(phone)

  const productMap = {
    '45': '_45',
    '47': '_47',
    '44s': '_44s',
    '44fp': '_44fp',
    '46': '_46',
    '62s': '_62s',
    '62fp': '_62fp'
  }

  // const userId = await db.query(queries.insertUser, { name, phone, email, company, port, vessel, title, level })
  // console.log('New Stuff Here: ' + userId)
  // user_id = userId[0].id
  // console.log('Alpha ' + userId[0].id)
  // console.log('Bravo ' + user_id)
  // .then(data => {
  //   console.log('Success entering NEW USER into database')
  //   console.log('RETURN DATA HERE ', data)
  //   user_id = parseInt(data[0].id)
  //   res.status(200).json(data)
  // })
  // .catch(err => console.log('Error inserting new user: ', err))

  // [ '45', '47', '46' ]
  
  // const limit = pLimit(4)

  // let userProducts = products.map(product => [`${productMap[product]}a`, `${productMap[product]}b`, `${productMap[product]}c`,`${productMap[product]}d`])

  // userProducts = userProducts.flat()

  // console.log('USER PRODUCTS HERE: ', userProducts)
  
  // let promises = userProducts.map(product_id => limit(() => db.query(queries.insertUsersProducts, { product_id, user_id })))

  // let insertedUserProducts = await Promise.all(promises)

  // console.log('YO YO YO')
  // console.log('Inserted User Products: ', insertedUserProducts)



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