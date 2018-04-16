const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Blockchain = require('./blockchain');
const Wallet = require('./wallet');

describe('TransactionPool', () => {
    let tp, bc, transaction, wallet;

    beforeEach(() => {
        tp = new TransactionPool();
        bc = new Blockchain();
        wallet = new Wallet();
        transaction = wallet.createTransaction('recipient-address', 50, bc, tp);
    });

    describe('#updateOrAddTransaction', () => {
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

    describe('#clear', () => {
        it('clears transactions', () => {
            tp.clear();
            expect(tp.transactions).toEqual([]);
        });
    });

    describe('#validTransactions', () => {
        describe('when valid and corrupted transactions mixed', () => {
            let validTransactions;

            beforeEach(() => {
                validTransactions = [...tp.transactions];
                for (let i = 0; i < 6; i++) {
                    wallet = new Wallet();
                    transaction = wallet.createTransaction('recipient-address', 50, bc, tp)
                    if (i % 2 === 0) {
                        transaction.input.amount = 99999;
                    } else {
                        validTransactions.push(transaction);
                    }
                }
            });

            it('sees difference between valid and corrupted transactions', () => {
                expect(JSON.stringify(tp.validTransactions())).not
                    .toEqual(JSON.stringify(tp.transactions));
            });

            it('returns only valid transactions', () => {
                expect(JSON.stringify(tp.validTransactions()))
                    .toEqual(JSON.stringify(validTransactions));
            });
        });
    });
});
