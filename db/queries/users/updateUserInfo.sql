update users
set first_name = ${first_name},
    last_name = ${last_name},
    email = ${email},
    title = ${title},
    company = ${company}, 
    vessel = ${vessel}, 
    port = ${port}
where id = ${id}