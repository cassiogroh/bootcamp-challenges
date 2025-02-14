import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    };

    const existentProducts = await this.productsRepository.findAllById(products);

    if (!existentProducts.length) {
      throw new AppError('Products not found');
    };

    const existentProductsIds = existentProducts.map(product => product.id);

    const checkNonExistingProducts = products.filter(
      product => !existentProductsIds.includes(product.id)
    );

    if (checkNonExistingProducts.length) {
      throw new AppError(`Product ${checkNonExistingProducts[0]} not found`);
    };

    const findProductsWithNoQuantityAvailable = products.filter(
      product => existentProducts.filter(p => p.id === product.id)[0].quantity < product.quantity
    );

    if (findProductsWithNoQuantityAvailable.length) {
      throw new AppError(`Quantity of ${findProductsWithNoQuantityAvailable[0].quantity} not available`);
    };

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existentProducts.filter(p => p.id === product.id)[0].price
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: serializedProducts
    });

    const { order_products } = order;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity: existentProducts.filter(
        p => p.id === product.product_id)[0].quantity - product.quantity
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
