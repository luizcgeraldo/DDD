import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total,
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {

        try {
            await OrderModel.update(
                {
                    customer_id: entity.customerId,
                    total: entity.total,
                },
                {
                    where: {
                        id: entity.id,
                    },
                }
            );

            await OrderItemModel.destroy({
                where: {
                    order_id: entity.id,
                },
            });

            await OrderItemModel.bulkCreate(
                entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                    order_id: entity.id,
                })),
            );
        } catch (error) {
            throw error;
        }
    }

     async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: ["items"],
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const items = orderModel.items;

        const item = new OrderItem(
            items[0].id,
            items[0].name,
            items[0].price,
            items[0].product_id,
            items[0].quantity
        );

        const order = new Order(id, orderModel.customer_id, [item]);
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.findAll({ include: [{ model: OrderItemModel }] })
        return orders.map(order => {
            const orderItems: Array<OrderItem> = []

            for (const iterator of order.items) {
                orderItems.push(new OrderItem(iterator.id, iterator.name, iterator.price, iterator.product_id, iterator.quantity))
            }

            return new Order(order.id, order.customer_id, orderItems)
        });
    }
}