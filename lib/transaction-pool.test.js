const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./wallet');

describe('TransactionPool', () => {
    let tp, transaction, wallet;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'recipient-address', 50)
        tp.updateOrAddTransaction(transaction);
    });

    describe('.updateOrAddTransaction', () => {
        it('adds transaction to the pool', () => {
            expect(tp.transactions.find(t => t.id === transaction.id))
                .toEqual(transaction);
        });

        it('updates transaction in the pool', () => {
            const oldTransaction = JSON.stringify(transaction);
            const newTransaction = transaction.update(wallet, 'next-recipient-address', 20);

            tp.updateOrAddTransaction(newTransaction);

            expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
                .not.toEqual(JSON.stringify(oldTransaction));
        });
    });
});
