const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('./config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static genesis() {
        const timestamp = 0;
        const firstHash = '';
        const data = []
        const hash = Block.hash(timestamp, firstHash, data, 0, DIFFICULTY);
        return new Block(timestamp, firstHash, hash, data, 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;

        let hash, timestamp;
        let nonce = 0;

        do {
            nonce += 1;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty, timestamp } =  lastBlock;
        return timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    }
}

module.exports = Block;