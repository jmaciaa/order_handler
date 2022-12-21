type Product = { id: number; name: string; price: number }
type ProductWQuantity = Product & { quantity: number }
type Promotions = {
  TWO_FOR_ONE?: TwoForOnePromo
  SPEND_X_SAVE_Y?: SpendXSaveYPromo
}

type TwoForOnePromo = { products: number[] }
type SpendXSaveYPromo = { x: number; y: number }[]

export class MyOrderHandler {
  public order: ProductWQuantity[]
  private readonly products: Product[]
  private readonly promotions: Promotions

  constructor(products: Product[], promotions: Promotions) {
    this.order = []
    this.products = products
    this.promotions = promotions
  }

  public add(itemId: number, quantity: number) {
    const products = this.products
    const item = products.find((product) => product.id === itemId)
    if (!item) throw new Error(`Item with id ${itemId} not found`)
    const productInOrder = this.order.find((product) => product.id === itemId)
    if (productInOrder) this.addQuantityToExistingProductInOrder(productInOrder, quantity)
    else this.order.push({ ...item, quantity })
  }

  public getTotal() {
    const twoForOneDiscount = this.twoForOneDiscount()
    const subTotal =
      this.order.reduce((total, item) => total + item.price * item.quantity, 0) - twoForOneDiscount
    const spendXSaveYDiscount = this.spendXSaveYDiscount(subTotal)
    return subTotal - spendXSaveYDiscount
  }

  private addQuantityToExistingProductInOrder(productInOrder: ProductWQuantity, quantity: number) {
    const updatedProduct = {
      ...productInOrder,
      quantity: productInOrder.quantity + quantity,
    }
    const updatedOrder = [
      ...this.order.filter((product) => product.id !== productInOrder.id),
      updatedProduct,
    ]
    this.order = updatedOrder
  }

  private twoForOneDiscount() {
    const twoForOnePromos = this.promotions.TWO_FOR_ONE
    if (!twoForOnePromos) return 0
    const discountedProducts = twoForOnePromos.products
    return this.order.reduce((totalDiscount, product) => {
      if (discountedProducts.includes(product.id)) {
        const discount = Math.floor(product.quantity / 2) * product.price
        totalDiscount += discount
      }
      return totalDiscount
    }, 0)
  }

  private spendXSaveYDiscount(subTotal: number) {
    const spendXSaveYPromos = this.promotions.SPEND_X_SAVE_Y
    if (!spendXSaveYPromos) return 0
    const sortedSpendXSaveYPromos = this.sortSpendXSaveYPromos(spendXSaveYPromos)
    const applicablePromo = sortedSpendXSaveYPromos.find((promo) => promo.x <= subTotal)
    return applicablePromo ? applicablePromo.y : 0
  }

  private sortSpendXSaveYPromos(spendXSaveYPromotions: SpendXSaveYPromo) {
    return spendXSaveYPromotions.sort((a, b) => b.x - a.x)
  }
}
