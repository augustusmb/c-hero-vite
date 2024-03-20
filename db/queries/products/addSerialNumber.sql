INSERT INTO product_serial_numbers (serial_number, user_id)
VALUES (${serialNumber}, ${userId})
ON CONFLICT (serial_number, user_id) DO NOTHING