DELETE FROM product_serial_numbers
WHERE user_id = ${userId}
AND serial_number = ${serialNumber};