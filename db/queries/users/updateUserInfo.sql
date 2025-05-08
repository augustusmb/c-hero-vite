UPDATE users 
SET 
  first_name = ${first_name},
  last_name = ${last_name},
  email = ${email},
  phone = ${phone},
  position = ${position_type},
  company_id = ${company_id},
  port_id = ${port_id},
  vessel_id = ${vessel_id}
WHERE id = ${id}