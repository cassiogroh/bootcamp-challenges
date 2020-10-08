import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type
    });

    const { total } = this.transactionsRepository.getBalance();

    if (total < 0) {
      this.transactionsRepository.delete();
      throw Error("You don't have enoguh money for this transaction")
    }

    return transaction;
  }
};

export default CreateTransactionService;
