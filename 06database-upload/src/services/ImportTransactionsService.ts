// import csvParse from 'csv-parse'

import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<number> {

    return 3
    // Promise<Transaction[]>

    //   csvParse.on('data', async line => {
    //     const [title, type, value, category] = line.map((cell: string) =>
    //       cell.trim(),
    //     );
    // }
  }
}

export default ImportTransactionsService;
