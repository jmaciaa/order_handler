# My Order Handler

MyOrderHandler is a service for creating an order and applying promotions to it.

When calculating the total price of the order, first all items are checked to see if one or more menus can be formed so the client can benefit from the 'Menu' promo (if available).

Note: The most expensive items are included in the menu promo i.e. if menu includes one starter and one meat and the order is 'one 6€ starter, one 4€ starter and one meat dish' the 6€ starter will be the one included in the menu.

Once we have the menus formed we take the remaining items and add their prices and substract the discounts from the '2 x 1' promos.

Finally the 'Spend X Save Y' promo is applied.

## Note:

- Promotions must be configured in the format provided in the test.data.json file.
- In the `TWO_FOR_ONE` promo any number of product ids can be added to the `products` array.
- In the `SPEND_X_SAVE_Y` promo any number of promos can be added (e.g. `[{x: 20, y: 5}, {x: 30, y: 10}, /* ... */]`). The biggest possible discount will be applied.
- In the `MENU` promo, for simplicity, there can be only one menu and there can only be one item per type of product per menu i.e. one menu can be 'one starter + one meat' but not 'two starters + one meat'.

## Test:

The service is already compiled under the /dist folder.
Just run `npm test` to run tests
