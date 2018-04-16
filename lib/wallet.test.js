const Wallet = require('./wallet');
const Blockchain = require('./blockchain');
const TransactionPool = require('./transaction-pool');
const { INITIAL_BALANCE } = require('./config');

describe('Wallet', () => {
    let tp, bc, wallet;

    beforeEach(() => {
        tp = new TransactionPool();
        bc = new Blockchain();
        wallet = new Wallet();
    });

    describe('#createTransaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'random-address';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('doing same transaction twice', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
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

    describe('calculateBalance', () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;

            for (let i = 0; i < repeatAdd; ++i) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }

            bc.addBlock(tp.transactions)
        });

        it('calculates the balance for blockchain transation matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + addBalance * repeatAdd);
        });

        it('calculates the balance for blockchain transation matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance * repeatAdd);
        });

        describe('when recipient conducts transactions', () => {
            let substractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear();
                substractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, substractBalance, bc, tp)
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates recipient balance only using transactions since its most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance + addBalance);
                });
            });
        });
    });
});
