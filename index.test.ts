import { MyOrderHandler } from "./index"

describe("MyOrderHandler", () => {
  test("works as expected", () => {
    const orderHandler = new MyOrderHandler()
    orderHandler.add(12, 4)
    orderHandler.add(21, 2)
    const total = orderHandler.getTotal()
    expect(total).toBe(16)
  })
})
