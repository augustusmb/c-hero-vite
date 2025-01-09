SELECT 
    (SELECT json_agg(json_build_object('id', id, 'name', name)) FROM companies) as companies,
    (SELECT json_agg(json_build_object('id', id, 'name', name)) FROM vessels) as vessels,
    (SELECT json_agg(json_build_object('id', id, 'name', name)) FROM ports) as ports;