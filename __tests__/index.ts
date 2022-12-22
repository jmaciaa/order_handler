import { MyOrderHandler } from "../src/index"
import * as testData from "../data.json"

const { products, promotions } = testData

describe("MyOrderHandler", () => {
  test("adds items properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(21, 1)
    orderHandler.add(12, 2)
    orderHandler.add(37, 1)
    expect(orderHandler.order).toEqual(testData.mockedOrder)
  })

  test("throws when a not existing item is added to the order", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    expect(() => orderHandler.add(0, 1)).toThrow()
  })

  test("applies '2 x 1' discount properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(21, 2)
    orderHandler.add(12, 5)
    const total = orderHandler.getTotal()
    expect(total).toBe(19.5)
  })

  test("applies 'Spend X save Y' discount properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(21, 1)
    orderHandler.add(37, 4)
    const total = orderHandler.getTotal()
    expect(total).toBe(27)
  })

  test("applies menu promo properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(37, 1)
    orderHandler.add(12, 1)
    orderHandler.add(21, 1)
    const total = orderHandler.getTotal()
    expect(total).toBe(14)
  })

  test("applies all discounts together properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(12, 4)
    orderHandler.add(21, 1)
    orderHandler.add(37, 2)
    const total = orderHandler.getTotal()
    expect(total).toBe(29.5)
  })

  test("calculates total correctly if there are no promotions", () => {
    const noPromotions = {}
    const orderHandler = new MyOrderHandler(products, noPromotions)
    orderHandler.add(12, 4)
    orderHandler.add(21, 1)
    orderHandler.add(37, 2)
    const total = orderHandler.getTotal()
    expect(total).toBe(37)
  })
})
