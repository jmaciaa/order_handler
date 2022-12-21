import {
  ProductWQuantity,
  Product,
  Promotions,
  SpendXSaveYPromo,
  MenuPromo,
  ItemsGroupedByMenuComponent,
} from "./index.decs"
import { mapValues } from "./utils"

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
    const product = products.find((product) => product.id === itemId)
    if (!product) throw new Error(`Product with id ${itemId} not found`)
    const newItems = Array(quantity).fill(product)
    this.order = [...this.order, ...newItems]
  }

  public getTotal() {
    const { menusPrice, remainingItems } = this.checkForMenus()
    const twoForOneDiscounts = this.getTwoForOneDiscounts(remainingItems)
    const subTotal =
      remainingItems.reduce((total, item) => total + item.price, 0) - twoForOneDiscounts
    const spendXSaveYDiscount = this.getSpendXSaveYDiscount(subTotal)
    return menusPrice + subTotal - spendXSaveYDiscount
  }

  /** Checks if we can form menus from the items ordered, returning the price of the menus formed and the items that are not included in the menus */
  private checkForMenus() {
    const menuPromo = this.promotions.MENU
    if (!menuPromo) return { menusPrice: 0, remainingItems: this.order }
    const itemsGroupedByMenuComponent = this.groupItemsByMenuComponent(menuPromo)
    const sortedGroupedItems = this.sortItemsByPrice(itemsGroupedByMenuComponent)
    const { menus, remainingItems } = this.buildMenus(sortedGroupedItems)
    const menusPrice = menus.length * menuPromo.price
    return { menusPrice, remainingItems }
  }

  private getTwoForOneDiscounts(items: Product[]) {
    const twoForOneDiscountedProducts = this.promotions.TWO_FOR_ONE?.products
    if (!twoForOneDiscountedProducts) return 0
    const groupedItemsByProduct = this.groupItemsByProduct(items)
    return groupedItemsByProduct.reduce((totalDiscount, product) => {
      if (twoForOneDiscountedProducts.includes(product.id)) {
        const discount = Math.floor(product.quantity / 2) * product.price
        totalDiscount += discount
      }
      return totalDiscount
    }, 0)
  }

  private getSpendXSaveYDiscount(subTotal: number) {
    const spendXSaveYPromos = this.promotions.SPEND_X_SAVE_Y
    if (!spendXSaveYPromos) return 0
    const sortedSpendXSaveYPromos = this.sortSpendXSaveYPromos(spendXSaveYPromos)
    const applicablePromo = sortedSpendXSaveYPromos.find((promo) => promo.x <= subTotal)
    return applicablePromo ? applicablePromo.y : 0
  }

  private sortSpendXSaveYPromos(spendXSaveYPromotions: SpendXSaveYPromo) {
    return spendXSaveYPromotions.sort((a, b) => b.x - a.x)
  }

  private groupItemsByProduct(order: Product[]) {
    return order.reduce<ProductWQuantity[]>((products, item) => {
      const group = products.find((product) => product.id === item.id)
      if (!group) return [...products, { ...item, quantity: 1 }]
      return products.map((product) =>
        product.id === item.id ? { ...product, quantity: product.quantity + 1 } : product
      )
    }, [])
  }

  private groupItemsByMenuComponent(menuPromo: MenuPromo) {
    const emptyMenuComponentsDictionary = menuPromo.items.reduce<ItemsGroupedByMenuComponent>(
      (dic, productType) => {
        dic[productType] = []
        return dic
      },
      {}
    )
    const menuComponentsDictionary = this.order.reduce((dic, product) => {
      if (product.type in dic) {
        dic[product.type] = [...dic[product.type], product]
      }
      return dic
    }, emptyMenuComponentsDictionary)

    return menuComponentsDictionary
  }

  private buildMenus(sortedGroupedItems: ItemsGroupedByMenuComponent) {
    const menus = []
    while (this.areThereItemsInEveryGroup(sortedGroupedItems)) {
      let menu: Product[] = []
      Object.keys(sortedGroupedItems).forEach((key) => {
        const item = sortedGroupedItems[key].pop()
        if (item) menu.push(item)
      })
      menus.push(menu)
    }

    const remainingItems = Object.values(sortedGroupedItems).flat()
    return { menus, remainingItems }
  }

  private sortItemsByPrice(dic: ItemsGroupedByMenuComponent) {
    return mapValues<Product[], Product[]>(dic, (value) => value.sort((a, b) => a.price - b.price))
  }

  private areThereItemsInEveryGroup(sortedGroupedItems: ItemsGroupedByMenuComponent) {
    return Object.values(sortedGroupedItems).every((items) => items.length !== 0)
  }
}
