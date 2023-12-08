import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

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
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should update order", async () => {
        const createCustomer = async () => {
            const customerRepository = new CustomerRepository();
            const customer = new Customer("123", "Customer 1");
            const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
            customer.changeAddress(address);
            await customerRepository.create(customer);
            return customer;
        };

        const createProduct = async (id: string, name: string, price: number) => {
            const productRepository = new ProductRepository();
            const product = new Product(id, name, price);
            await productRepository.create(product);
            return product;
        };

        const createOrder = (customerId: string, items: OrderItem[]) => {
            return new Order("1", customerId, items);
        };

        const createOrderItem = (id: string, name: string, price: number, productId: string, quantity: number) => {
            return new OrderItem(id, name, price, productId, quantity);
        };

        const customer = await createCustomer();
        const product = await createProduct("1", "Product 1", 10);

        const orderItem = createOrderItem("1", product.name, product.price, product.id, 1);
        let order = createOrder(customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: '1',
            customer_id: '123',
            total: 10,
            items: [
                {
                    id: '1',
                    name: 'Product 1',
                    order_id: '1',
                    price: 10,
                    quantity: 1,
                    product_id: '1',
                },
            ],
        });

        const product2 = await createProduct("2", "Product 2", 20);
        const orderItem2 = createOrderItem("2", product2.name, product2.price, product2.id, 2);

        order.addItem(orderItem2);

        try {
            await orderRepository.update(order);
        } catch (error) {
            throw new Error('Erro ao atualizar o pedido:'+ error);
        }

        let queriedOrder = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(queriedOrder.toJSON()).toStrictEqual(
            {
                id: '1',
                customer_id: '123',
                total: 50,
                items: [
                    {
                        id: '1',
                        name: 'Product 1',
                        order_id: '1',
                        price: 10,
                        quantity: 1,
                        product_id: '1',
                    },
                    {
                        id: '2',
                        name: 'Product 2',
                        order_id: '1',
                        price: 20,
                        quantity: 2,
                        product_id: '2',
                    },
                ],
            },
        );

    });

    it("should find order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            5
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should throw an error when customer is not found", async () => {
        const orderRepository = new OrderRepository();

        expect(async () => {
            await orderRepository.find("456ABC");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Produto 1", 10);
        await productRepository.create(product1);

        const product2 = new Product("321", "Produto 2", 20);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem1]);
        await orderRepository.create(order);

        const order2 = new Order("2", customer.id, [orderItem2]);
        await orderRepository.create(order2);

        const result = await orderRepository.findAll();

        expect(result.length).toEqual(2);
    });
});