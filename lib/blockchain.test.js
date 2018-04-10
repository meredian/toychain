const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    describe('#isValid', () => {
        it('adds new block', () => {
            const data = 'next block data';
            bc.addBlock(data);
            expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
        });    
    });

    describe('.isValid', () => {
        it('validates a valid chain', () => {
            bc.addBlock('foo');
            expect(Blockchain.isValidChain(bc.chain)).toBe(true);
        });

        it('invalidates chain with corrupt genesis block',() => {
            bc.chain[0].data = 'bad data';
            expect(Blockchain.isValidChain(bc.chain)).toBe(false);
        });

        it('invalidates chain with corrupt genesis block',() => {
            bc.addBlock('foo');
            bc.chain[1].data = 'not foo'
            expect(Blockchain.isValidChain(bc.chain)).toBe(false);
        });
    });

    describe('#replaceChain', () => {
        it('replaces the chain with a valid longer chain', () => {
            bc2.addBlock('goo');
            bc.replaceChain(bc2.chain);
            expect(bc.chain).toEqual(bc2.chain);
        });

        it('does not replace chain with one of less that or equal length', () => {
            bc.addBlock('foo');
            bc.replaceChain(bc2.chain);
            expect(bc.chain).not.toEqual(bc2.chain);
        });
    });
});