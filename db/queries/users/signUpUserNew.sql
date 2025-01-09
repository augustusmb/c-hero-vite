INSERT INTO
  users (
    first_name, 
    last_name, 
    phone, 
    email, 
    position,
    company_id, 
    port_id, 
    vessel_id
  )
VALUES
  (
    ${firstName}, 
    ${lastName}, 
    ${phone}, 
    ${email}, 
    ${position_type},
    ${companyId}, 
    ${portId}, 
    ${vesselId}
  )
ON CONFLICT (phone)
DO NOTHING
RETURNING *;