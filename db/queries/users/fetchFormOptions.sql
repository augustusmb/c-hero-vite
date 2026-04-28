SELECT
    (SELECT json_agg(json_build_object('id', id, 'name', name) ORDER BY lower(name)) FROM companies) as companies,
    (SELECT json_agg(json_build_object('id', id, 'name', name) ORDER BY lower(name)) FROM vessels) as vessels,
    (SELECT json_agg(json_build_object('id', id, 'name', name) ORDER BY lower(name)) FROM ports) as ports;