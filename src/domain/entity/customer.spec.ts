import Address from "./address"
import Customer from "./customer"

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => new Customer("", "abc")).toThrowError("Id is required")
    })

    it("should throw error when name is empty", () => {
        expect(() => new Customer("123", "")).toThrowError("Name is required")
    })

    it("should change name", () => {
        const customer = new Customer("123", "abc")
        customer.changeName("John")

        expect(customer.name).toBe("John")
    })

    it("should activate customer", () => {
        const customer = new Customer("1", "Customer")
        const address = new Address("Street", 1, "Zip", "City")
        customer.Address = address

        customer.activate()

        expect(customer.isActive()).toBe(true)
    })

    it("should throw error when address is undefined when activate a customer", () => {        
        expect(() => {
            const customer = new Customer("1", "Customer")        
            customer.activate()
        }).toThrowError("Address is mandatory to activate a customer")
    })

    it("should deactivate customer", () => {
        const customer = new Customer("1", "Customer")

        customer.deactivate()

        expect(customer.isActive()).toBe(false)
    })

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })
})