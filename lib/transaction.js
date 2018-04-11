const ChainUtil = require('./chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(sendersWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === sendersWallet.publicKey);

        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, sendersWallet);

        return this;
    }

    static newTransaction(sendersWallet, recipient, amount) {
        const transaction = new this();

        if (amount > sendersWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        transaction.outputs.push(...[
            { amount: sendersWallet.balance - amount, address: sendersWallet.publicKey },
            { amount, address: recipient },
        ]);

        Transaction.signTransaction(transaction, sendersWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs),
        );
    }
}

module.exports = Transaction;