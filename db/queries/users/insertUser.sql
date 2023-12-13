INSERT INTO
  users (name, phone, email, title, company, port, vessel, level)
VALUES
  (${name}, ${phone}, ${email}, ${title}, ${company}, ${port}, ${vessel}, ${level})
ON CONFLICT (phone)
DO NOTHING
RETURNING id