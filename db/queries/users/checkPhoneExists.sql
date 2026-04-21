SELECT EXISTS (SELECT 1 FROM users WHERE phone = ${phone}) AS exists
