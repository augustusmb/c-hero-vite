update users
set name = ${name},
    email = ${email},
    title = ${title},
    company = ${company}, 
    vessel = ${vessel}, 
    port = ${port}
where id = ${id}