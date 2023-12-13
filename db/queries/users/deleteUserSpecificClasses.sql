DELETE
from users_products
WHERE
users_products.user_id = ${user_id}
AND
users_products.product_id = ${product_id}