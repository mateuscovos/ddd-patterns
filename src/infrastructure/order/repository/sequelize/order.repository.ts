import { Op } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        }, {
            include: [{ model: OrderItemModel }]
        });
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update({ total: entity.total() }, { where: { id: entity.id } })
        await this._updateOrderItems(entity) 
    }

    private async _updateOrderItems(order: Order): Promise<void> {
        const items = order.items

        await OrderItemModel.destroy({
            where: {
                id: { [Op.notIn]: [...items.map(it => it.id)] }
            }
        })

        const itemsPromise = items.map(async item => {
            return await OrderItemModel.upsert({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: order.id
            })
        })

        await Promise.all([itemsPromise])
    }


    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ where: { id }, include: ["items"] })
        return this._mapToOrder(orderModel)
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({ include: ["items"] })
        return ordersModel.map(this._mapToOrder)
    }

    private _mapToOrder(orderModel: OrderModel): Order {
        const items = orderModel.items.map(it =>
            new OrderItem(it.id, it.name, it.price, it.product_id, it.quantity))

        return new Order(orderModel.id, orderModel.customer_id, items)
    }
}