import Order from "./order"
import OrderItem from "./order_item"

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => new Order("", "123", []))
            .toThrowError("Id is required")
    })

    it("should throw error when customer id is empty", () => {
        expect(() => new Order("1", "", []))
            .toThrowError("CustomerId is required")
    })

    it("should throw error when items is empty", () => {
        expect(() => new Order("1", "123", []))
            .toThrowError("Items are required")
    })

    it("should calculate total", () => {
        const item1 = new OrderItem("1", "item 1", 100, "p1", 2)
        const item2 = new OrderItem("2", "item 2", 150, "p2", 2)

        const order = new Order("1", "c1", [item1])

        expect(order.total()).toBe(200)

        const order2 = new Order("2", "c1", [item1, item2])

        expect(order2.total()).toBe(500)
    })

    it("should throw error if the item quantity is less or equal 0", () => {
        expect(() => new OrderItem("1", "item 1", 100, "p1", 0)).toThrowError("Quantity must be greater than 0")
    })

    it("should add a new item", () => {
        const item1 = new OrderItem("1", "item 1", 100, "p1", 2)
        const order = new Order("1", "c1", [item1])
        
        expect(order.items).toHaveLength(1)
        expect(order.items).toContainEqual(item1)
        
        const item2 = new OrderItem("2", "item 2", 150, "p2", 2)
        order.addItem(item2)
        order.addItem(item2)
        order.addItem(item2)
        order.addItem(item2)
        order.addItem(item2)

        expect(order.items).toHaveLength(2)
        expect(order.items).toContainEqual(item1)
        expect(order.items).toContainEqual(item2)
    })

    it("should remove a item", () => {
        const item1 = new OrderItem("1", "item 1", 100, "p1", 2)
        const item2 = new OrderItem("2", "item 2", 150, "p2", 2)
        const order = new Order("1", "c1", [item1, item2])

        expect(order.items).toHaveLength(2)
        expect(order.items).toContainEqual(item1)
        expect(order.items).toContainEqual(item2)

        order.removeItem(item1)

        expect(order.items).toHaveLength(1)
        expect(order.items).toContainEqual(item2)
        
        order.removeItem(new OrderItem("1", "1", 1, "1", 1))

        expect(order.items).toHaveLength(1)
        expect(order.items).toContainEqual(item2)

        order.removeItem(item2)

        expect(order.items).toHaveLength(0)

        order.removeItem(new OrderItem("1", "1", 1, "1", 1))

        expect(order.items).toHaveLength(0)
    })
})