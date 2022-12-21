export type Product = { id: number; name: string; price: number; type: string }

export type ProductWQuantity = Product & { quantity: number }

export type Promotions = {
  TWO_FOR_ONE?: TwoForOnePromo
  SPEND_X_SAVE_Y?: SpendXSaveYPromo
  MENU?: MenuPromo
}

export type TwoForOnePromo = { products: number[] }
export type SpendXSaveYPromo = { x: number; y: number }[]
export type MenuPromo = { items: string[]; price: number }

export type ItemsGroupedByMenuComponent = Record<string, Product[]>
