import Order from "../entity/order"
import OrderItem from "../entity/order_item"

interface OrderFactoryProps {
    id: string
    customerId: string
    items: {
        id: string
        name: string
        productId: string
        quantity: number
        price: number
    }[]
}

export default class OrderFactory {
    static create(props: OrderFactoryProps): Order {
        const items = props.items.map(({ id, name, price, productId, quantity }) => new OrderItem(id, name, price, productId, quantity))
        return new Order(props.id, props.customerId, items)
    }
}