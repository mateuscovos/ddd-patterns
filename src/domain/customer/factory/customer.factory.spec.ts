import Address from "../value-object/address"
import CustomerFactory from "./customer.factory"

describe("Customer factory unit tests", () => {
    it("should create a customer", () => {
        const customer = CustomerFactory.create("customer name")
        
        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("customer name")
        expect(customer.Address).toBeUndefined()
    })

    it("should create a customer with an address", () => {
        const address = new Address("street", 1, "zip", "city")
        const customer = CustomerFactory.createWithAddress("customer name", address)
        
        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("customer name")
        expect(customer.Address).toBe(address)
    })
})