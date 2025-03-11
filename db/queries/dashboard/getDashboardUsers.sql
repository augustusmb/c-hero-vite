SELECT 
    users.*,
    companies.name AS company,
    vessels.name AS vessel,
    ports.name AS port
FROM users
LEFT JOIN companies ON users.company_id = companies.id
LEFT JOIN vessels ON users.vessel_id = vessels.id
LEFT JOIN ports ON users.port_id = ports.id
WHERE users.vessel_id = $1