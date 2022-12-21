import { MyOrderHandler } from "./index"
import * as testData from "./test.data.json"

const { products, promotions } = testData

describe("MyOrderHandler", () => {
  test("adds items properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(21, 3)
    orderHandler.add(12, 4)
    orderHandler.add(21, 2)
    expect(orderHandler.order).toEqual(testData.mockedOrder)
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
    orderHandler.add(12, 1)
    orderHandler.add(37, 5)
    const total = orderHandler.getTotal()
    expect(total).toBe(38)
  })

  test("applies all discounts properly", () => {
    const orderHandler = new MyOrderHandler(products, promotions)
    orderHandler.add(12, 4)
    orderHandler.add(37, 2)
    const total = orderHandler.getTotal()
    expect(total).toBe(17)
  })
})
