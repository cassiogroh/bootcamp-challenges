import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        // if (transaction.type === 'income') {
        //   accumulator.income += transaction.value;
        // } else {
        //   accumulator.outcome += transaction.value;
        // }

        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      }, {
        income: 0,
        outcome: 0,
        total: 0
      });

    const total = income - outcome;

    const balance = {
      total,
      income,
      outcome
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'> ): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }

  public delete(){
    this.transactions.pop();
  }
}

export default TransactionsRepository;
