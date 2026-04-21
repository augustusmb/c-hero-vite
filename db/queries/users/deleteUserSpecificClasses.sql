DELETE
from users_products
WHERE
users_products.user_id = ${user_id}
AND
users_products.class_id = ${class_id}