INSERT INTO product_serial_numbers (product_id, serial_number, user_id)
VALUES (${productId}, ${serialNumber}, ${userId})
ON CONFLICT (product_id, serial_number, user_id) DO NOTHING