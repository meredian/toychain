const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        if (!Transaction.verifyTransaction(transaction)) {
            console.log("Failed to verify transaction.");
            return;
        }

        let transactionWithId = this.transactions.find((t) => t.id === transaction.id);

        if (transactionWithId != null) {
            let transactionIndex = this.transactions.indexOf(transactionWithId);
            this.transactions[transactionIndex] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find((t) => t.input.address === address);
    }
};

module.exports = TransactionPool;
