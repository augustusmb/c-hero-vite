DELETE
from users_products
WHERE
users_products.user_id = ${userId}
;
DELETE
from users
WHERE
users.id = ${userId}