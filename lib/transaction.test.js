const Transaction = require('./transaction');
const Wallet = require('./wallet');

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'recipient-address';
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    });

    describe('.newTransaction', () => {

        it('outputs the `amount` substracted from the wallet balance', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount);
        });

        it('outputs the `amount` added to the recipient', () => {
            expect(transaction.outputs.find(output => output.address === recipient).amount)
                .toEqual(amount);
        });

        it('inputs the balance of the wallet', () => {
            expect(transaction.input.amount).toEqual(wallet.balance);
        });

        describe('transaction witha an amount that exceeds the balance', () => {
            beforeEach(() => {
                amount = 50000;
                transaction = Transaction.newTransaction(wallet, recipient, amount);
            });

            it('does not create the transactions', () => {
                expect(transaction).toEqual(undefined);
            });
        });
    });

    describe('.verifyTransaction', () => {
        it('validates a valid transaction', () => {
            expect(Transaction.verifyTransaction(transaction)).toBe(true);
        });

        it('invalidates a corrupted transaction', () => {
            transaction.outputs[0] = 50000;
            expect(Transaction.verifyTransaction(transaction)).toBe(false);
        });
    });

    describe('#update', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'next-recipient-address';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('substracts the next amount from sender\'s output', () => {
            const senderOutput = transaction.outputs.find(output => output.address === wallet.publicKey);
            expect(senderOutput.amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            const nextRecipientOutput = transaction.outputs.find(output => output.address === nextRecipient);
            expect(nextRecipientOutput.amount).toEqual(nextAmount);
        });
    });
});