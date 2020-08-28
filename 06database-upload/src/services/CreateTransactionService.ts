import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category_id: string;
}


class CreateTransactionService {
  public async execute({ title, value, type, category_id }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance(transactions);

    if (balance.total < 0 ) {
      throw new AppError("You don't have enough money to make this transactions");
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
