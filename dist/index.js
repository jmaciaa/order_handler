"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyOrderHandler = void 0;
const utils_1 = require("./utils");
class MyOrderHandler {
    constructor(products, promotions) {
        this.order = [];
        this.products = products;
        this.promotions = promotions;
    }
    add(itemId, quantity) {
        const products = this.products;
        const product = products.find((product) => product.id === itemId);
        if (!product)
            throw new Error(`Product with id ${itemId} not found`);
        const newItems = Array(quantity).fill(product);
        this.order = [...this.order, ...newItems];
    }
    getTotal() {
        const { menusPrice, remainingItems } = this.checkForMenus();
        const twoForOneDiscounts = this.getTwoForOneDiscounts(remainingItems);
        const subTotal = remainingItems.reduce((total, item) => total + item.price, 0) - twoForOneDiscounts;
        const spendXSaveYDiscount = this.getSpendXSaveYDiscount(subTotal);
        return menusPrice + subTotal - spendXSaveYDiscount;
    }
    /** Checks if we can form menus from the items ordered, returning the price of the menus formed and the items that are not included in the menus */
    checkForMenus() {
        const menuPromo = this.promotions.MENU;
        if (!menuPromo)
            return { menusPrice: 0, remainingItems: this.order };
        const itemsGroupedByMenuComponent = this.groupItemsByMenuComponent(menuPromo);
        const sortedGroupedItems = this.sortItemsByPrice(itemsGroupedByMenuComponent);
        const { menus, remainingItems } = this.buildMenus(sortedGroupedItems);
        const menusPrice = menus.length * menuPromo.price;
        return { menusPrice, remainingItems };
    }
    getTwoForOneDiscounts(items) {
        var _a;
        const twoForOneDiscountedProducts = (_a = this.promotions.TWO_FOR_ONE) === null || _a === void 0 ? void 0 : _a.products;
        if (!twoForOneDiscountedProducts)
            return 0;
        const groupedItemsByProduct = this.groupItemsByProduct(items);
        return groupedItemsByProduct.reduce((totalDiscount, product) => {
            if (twoForOneDiscountedProducts.includes(product.id)) {
                const discount = Math.floor(product.quantity / 2) * product.price;
                totalDiscount += discount;
            }
            return totalDiscount;
        }, 0);
    }
    getSpendXSaveYDiscount(subTotal) {
        const spendXSaveYPromos = this.promotions.SPEND_X_SAVE_Y;
        if (!spendXSaveYPromos)
            return 0;
        const sortedSpendXSaveYPromos = this.sortSpendXSaveYPromos(spendXSaveYPromos);
        const applicablePromo = sortedSpendXSaveYPromos.find((promo) => promo.x <= subTotal);
        return applicablePromo ? applicablePromo.y : 0;
    }
    sortSpendXSaveYPromos(spendXSaveYPromotions) {
        return spendXSaveYPromotions.sort((a, b) => b.x - a.x);
    }
    groupItemsByProduct(order) {
        return order.reduce((products, item) => {
            const group = products.find((product) => product.id === item.id);
            if (!group)
                return [...products, Object.assign(Object.assign({}, item), { quantity: 1 })];
            return products.map((product) => product.id === item.id ? Object.assign(Object.assign({}, product), { quantity: product.quantity + 1 }) : product);
        }, []);
    }
    groupItemsByMenuComponent(menuPromo) {
        const emptyMenuComponentsDictionary = menuPromo.items.reduce((dic, productType) => {
            dic[productType] = [];
            return dic;
        }, {});
        const menuComponentsDictionary = this.order.reduce((dic, product) => {
            if (product.type in dic) {
                dic[product.type] = [...dic[product.type], product];
            }
            return dic;
        }, emptyMenuComponentsDictionary);
        return menuComponentsDictionary;
    }
    buildMenus(sortedGroupedItems) {
        const menus = [];
        while (this.areThereItemsInEveryGroup(sortedGroupedItems)) {
            let menu = [];
            Object.keys(sortedGroupedItems).forEach((key) => {
                const item = sortedGroupedItems[key].pop();
                if (item)
                    menu.push(item);
            });
            menus.push(menu);
        }
        const remainingItems = Object.values(sortedGroupedItems).flat();
        return { menus, remainingItems };
    }
    sortItemsByPrice(dic) {
        return (0, utils_1.mapValues)(dic, (value) => value.sort((a, b) => a.price - b.price));
    }
    areThereItemsInEveryGroup(sortedGroupedItems) {
        return Object.values(sortedGroupedItems).every((items) => items.length !== 0);
    }
}
exports.MyOrderHandler = MyOrderHandler;
