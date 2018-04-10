const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${JSON.stringify(data)}`).toString();
    }

    static blockHash(block) {
        return this.hash(block.timestamp, block.lastHash, block.data);
    }

    static genesis() {
        const timestamp = 0;
        const firstHash = '';
        const data = []
        const hash = Block.hash(timestamp, firstHash, data);
        return new Block(timestamp, firstHash, hash, data);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);
        return new Block(timestamp, lastHash, hash, data);
    }
}

module.exports = Block;