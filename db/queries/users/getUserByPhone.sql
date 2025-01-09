SELECT 
    users.*,
    companies.name AS company,
    vessels.name as vessel,
    ports.name as port
FROM users
LEFT JOIN companies ON users.company_id = companies.id
LEFT JOIN vessels ON users.vessel_id = vessels.id
LEFT JOIN ports ON users.port_id = ports.id
WHERE users.phone = ${phone}