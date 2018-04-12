const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
    let tp, wallet;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
    });

    describe('#createTransaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'random-address';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('doing same transaction twice', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('doubles the `sendAmount` substracted from the wallet balance', () => {
                const updatedAmount = transaction.outputs.find(output => output.address === wallet.publicKey).amount;
                expect(updatedAmount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones `sendAmount` output for the recipient', () => {
                const recipientAmounts = transaction.outputs.filter(output => output.address === recipient)
                    .map(output => output.amount);
                expect(recipientAmounts).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});
