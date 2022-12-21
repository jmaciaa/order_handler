"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyOrderHandler = void 0;
const data_json_1 = __importDefault(require("./data.json"));
class MyOrderHandler {
    constructor() {
        this.order = [];
    }
    add(itemId, quantity) {
        const products = data_json_1.default.products;
        const item = products.find((product) => product.id === itemId);
        if (!item)
            throw new Error(`Item with id ${itemId} not found`);
        const productInOrder = this.order.find((product) => product.id === itemId);
        if (productInOrder)
            this.addQuantityToExistingProductInOrder(productInOrder, quantity);
        else
            this.order.push(Object.assign(Object.assign({}, item), { quantity }));
    }
    getTotal() {
        const twoForOneDiscount = this.twoForOneDiscount();
        const subTotal = this.order.reduce((total, item) => total + item.price * item.quantity, 0);
        const spendXSaveYDiscount = this.spendXSaveYDiscount(subTotal);
        return subTotal - twoForOneDiscount - spendXSaveYDiscount;
    }
    addQuantityToExistingProductInOrder(productInOrder, quantity) {
        const updatedProduct = Object.assign(Object.assign({}, productInOrder), { quantity: productInOrder.quantity + quantity });
        const updatedOrder = [
            ...this.order.filter((product) => product.id !== productInOrder.id),
            updatedProduct,
        ];
        this.order = updatedOrder;
    }
    twoForOneDiscount() {
        const twoForOnePromos = data_json_1.default.promotions.TWO_FOR_ONE;
        if (!twoForOnePromos)
            return 0;
        const discountedProducts = twoForOnePromos.products;
        return this.order.reduce((totalDiscount, product) => {
            if (discountedProducts.includes(product.id)) {
                const discount = Math.floor(product.quantity / 2) * product.price;
                totalDiscount += discount;
            }
            return totalDiscount;
        }, 0);
    }
    spendXSaveYDiscount(subTotal) {
        const spendXSaveYPromos = data_json_1.default.promotions.SPEND_X_SAVE_Y;
        if (!spendXSaveYPromos)
            return 0;
        const sortedSpendXSaveYPromos = this.sortSpendXSaveYPromos(spendXSaveYPromos);
        const applicablePromo = sortedSpendXSaveYPromos.find((promo) => promo.x <= subTotal);
        return applicablePromo ? applicablePromo.y : 0;
    }
    sortSpendXSaveYPromos(spendXSaveYPromotions) {
        return spendXSaveYPromotions.sort((a, b) => b.x - a.x);
    }
}
exports.MyOrderHandler = MyOrderHandler;
const orderHandler = new MyOrderHandler();
orderHandler.add(12, 4);
orderHandler.add(21, 2);
const total = orderHandler.getTotal();
console.log(total); // 16.00€
