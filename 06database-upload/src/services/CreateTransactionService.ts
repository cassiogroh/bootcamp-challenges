import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
};

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    };

    let categoryExists = await categoryRepository.findOne({
      where: { title: category }
    });

    if (!categoryExists) {
      categoryExists = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryExists);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryExists
    });

    await transactionsRepository.save(transaction);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance(transactions);

    if ( transaction.type === 'outcome' && balance.total<0 ) {
      await transactionsRepository.remove(transaction);
      throw new AppError("You don't have enough money to make this transactions");
    }

    return transaction;
  }
}

export default CreateTransactionService;
