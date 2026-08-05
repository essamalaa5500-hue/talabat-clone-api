Cart

✅ The cart can't contain products from two different restaurants.
✅ You can't add a product that isn't Available.
✅ Quantity can't exceed Stock.
✅ If the restaurant is closed, you can't add new products.

Order

✅ You can't place an Order with an empty cart.
✅ A delivery address must be present.
✅ The restaurant must be Active.
✅ The restaurant must be open at the time of the order.
✅ You can't order a Product that has been deleted.
✅ The price is stored inside OrderItem at the time the order is created, even if the product's price changes later.

Restaurant

✅ Can't accept a cancelled Order.
✅ Can't change an Order from Delivered back to Preparing.
✅ Can't accept the same Order twice.

Delivery

✅ A Driver can't pick up the order before it's Confirmed.
✅ A Driver can't take a new order while they already have an Active order.
✅ Can't change the Driver after the order is Delivered.

Payment

✅ Can't pay for a cancelled Order.
✅ Can't pay for an Order that's already paid.
✅ Refund can only happen if Payment status is Success.

Coupon

✅ The coupon must be Active.
✅ It must not be expired.
✅ The minimum order amount must be met.
✅ If the coupon is restricted to a specific restaurant, it can't be used with another restaurant.
✅ The usage limit must not be exhausted.
✅ The user must not have used it before (if it's limited to one use per user).

Review

✅ Can't create a Review before the order is Delivered.
✅ Can't create two Reviews for the same order.

User

✅ Email must be Unique.
✅ Phone must be Unique.
✅ A banned user can't Login.
