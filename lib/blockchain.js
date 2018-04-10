const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);
        this.chain.push(newBlock);

        return newBlock;
    }

    static isValidChain(chain) {
        const genesisBlock = Block.genesis();
        if (Block.blockHash(chain[0]) !== genesisBlock.hash) {
            return false;
        }

        if (chain[0].hash !== genesisBlock.hash) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash != lastBlock.hash) {
                return false;
            }

            if (block.hash != Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;
        }
        if (!Blockchain.isValidChain(newChain)){
            console.log('Received chain is not valid.');
            return;
        }

        this.chain = newChain;
        console.log('Replacing blockchain with a new chain.');
    }
}

module.exports = Blockchain;