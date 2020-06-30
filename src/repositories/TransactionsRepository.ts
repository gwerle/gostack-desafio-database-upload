import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const listAll = await this.find();
    return listAll.reduce(
      (accumulator, currentValue) => {
        const income =
          currentValue.type === 'income'
            ? accumulator.income + Number(currentValue.value)
            : accumulator.income;
        const outcome =
          currentValue.type === 'outcome'
            ? accumulator.outcome + Number(currentValue.value)
            : accumulator.outcome;

        return {
          income,
          outcome,
          total: income - outcome,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }
}

export default TransactionsRepository;
