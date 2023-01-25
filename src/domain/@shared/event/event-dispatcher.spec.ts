import Address from "../../customer/value-object/address"
import Customer from "../../customer/entity/customer"
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler"
import EventDispatcher from "./event-dispatcher"
import EnviaConsoleLog1Handler from "../../customer/event/customer/handler/envia-console-log-1.handler"
import EnviaConsoleLog2Handler from "../../customer/event/customer/handler/envia-console-log-2.handler"
import CustomerCreatedEvent from "../../customer/event/customer/customer-created.event"
import EnviaConsoleLogHandler from "../../customer/event/customer/handler/envia-console-log.handler"
import CustomerAddressChangedEvent from "../../customer/event/customer/customer-address-changed.event"
import ProductCreatedEvent from "../../product/event/product-created.event"

describe("Domain events tests", () => {

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
    })

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined()
    })

    it("should notify all event handlers of ProductCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        const productCreatedEvent = new ProductCreatedEvent({
            name: "product 1",
            description: "product description",
            price: 10.0
        })

        eventDispatcher.notify(productCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled()
    })

    it("should notify all event handlers of CustomerCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle")

        eventDispatcher.register("CustomerCreatedEvent", eventHandler)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)

        const customer = new Customer("1", "customer name")
        const address = new Address("street", 1, "zip", "city")
        customer.Address = address

        const event = new CustomerCreatedEvent(customer)

        eventDispatcher.notify(event)

        expect(spyEventHandler).toHaveBeenCalledTimes(1)
        expect(spyEventHandler2).toHaveBeenCalledTimes(1)
    })

    it("should notify all event handlers of CustomerAddressChangedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLogHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler)

        const customer = new Customer("1", "customer name")
        const address = new Address("street", 1, "zip", "city")
        customer.Address = address

        const event = new CustomerAddressChangedEvent(customer)

        eventDispatcher.notify(event)

        expect(spyEventHandler).toHaveBeenCalledTimes(1)
    })
})