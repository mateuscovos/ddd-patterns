import { Sequelize } from "sequelize-typescript";
import OrderModel from "./order.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderRepository from "./order.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "customer 1")
        const address = new Address("street 1", 1, "zip", "city")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2)

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: 20,
            items: [{
                id: "1",
                name: "product 1",
                price: 10,
                quantity: 2,
                order_id: "123",
                product_id: "123",
            }]
        })
    })

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "customer 1")
        const address = new Address("street 1", 1, "zip", "city")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2)

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: 20,
            items: [{
                id: "1",
                name: "product 1",
                price: 10,
                quantity: 2,
                order_id: "123",
                product_id: "123",
            }]
        })

        const product2 = new Product("321", "product 2", 20)
        await productRepository.create(product2)

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 5)

        order.removeItem(orderItem)
        order.addItem(orderItem2)

        await orderRepository.update(order)

        const orderModel2 = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })


        expect(orderModel2.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: 100,
            items: [{
                id: "2",
                name: "product 2",
                price: 20,
                quantity: 5,
                order_id: "123",
                product_id: "321",
            }]
        })
    })

    it("shoud find a order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "customer 1")
        const address = new Address("street 1", 1, "zip", "city")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2)

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        const foundOrder = await orderRepository.find(order.id)

        expect(order).toStrictEqual(foundOrder);
    })

    it("shoud find all orders", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "customer 1")
        const address = new Address("street 1", 1, "zip", "city")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "product 1", 10)
        await productRepository.create(product)

        const orderRepository = new OrderRepository()

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2)
        const order = new Order("123", "123", [orderItem])

        await orderRepository.create(order)

        const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2)
        const order2 = new Order("321", "123", [orderItem2])

        await orderRepository.create(order2)

        const foundOrders = await orderRepository.findAll()

        expect(foundOrders).toHaveLength(2);
        expect(foundOrders).toContainEqual(order);
        expect(foundOrders).toContainEqual(order2);
    })
});