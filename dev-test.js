const Block = require('./block');

const genesis = Block.genesis();
const nextBlock = Block.mineBlock(genesis, ['new data']);
console.log(genesis);
console.log(nextBlock)