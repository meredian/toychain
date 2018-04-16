const ChainUtil = require('./chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('./config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}.`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction != null) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = INITIAL_BALANCE;
        let transactions = [];

        blockchain.chain.forEach(block => {
            block.data.forEach(transaction => {
                transactions.push(transaction);
            })
        });

        const walletInputTransactions = transactions.filter(t => {
            return t.input.address === this.publicKey;
        });

        let startTime = 0;

        if (walletInputTransactions.length > 0) {
            const recentInputTransaction = walletInputTransactions.reduce((prev, current) => {
                return prev.input.timestamp > current.input.timestamp ? prev : current;
            });

            balance = recentInputTransaction.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputTransaction.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                })
            }
        });

        return balance;
    }
    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;
