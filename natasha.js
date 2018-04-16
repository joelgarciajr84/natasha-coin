const EncryptSHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return EncryptSHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createFirstBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createFirstBlock() {
        return new Block(Date.parse("2008-05-23"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    goMinePendingTransactions(RewardAddress){
        console.log("NUMBER OF PENDING TRANSACTIONS =>", this.pendingTransactions.length)
        if(this.pendingTransactions.length == 0){
            console.log('There is no pending transactions - nothing will be done!');
            return;
        }

        console.log('Starting mining ...!');
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('New Block successfully mined!');
        this.pendingTransactions--;
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction('NatashaCoin', RewardAddress, this.miningReward)
        ];
        console.log("NUMBER OF PENDING TRANSACTIONS =>", this.pendingTransactions.length)
    }

    createTransaction(transactionData){
        this.pendingTransactions.push(transactionData);
    }

    getBalanceOf(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.from === address){
                    balance -= trans.amount;
                }

                if(trans.to === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isTheChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let natashaCoin = new Blockchain();

natashaCoin.createTransaction(new Transaction('Snake', 'Ocelot', 500));
natashaCoin.createTransaction(new Transaction('Ocelot', 'BigBoss', 400));

natashaCoin.goMinePendingTransactions('Otacon');
natashaCoin.goMinePendingTransactions('Otacon');
natashaCoin.goMinePendingTransactions('Mantis');
natashaCoin.goMinePendingTransactions('Otacon');
natashaCoin.goMinePendingTransactions('Mantis');


console.log('\nBalance of Snake', natashaCoin.getBalanceOf('Snake'));
console.log('\nBalance of Ocelot', natashaCoin.getBalanceOf('Ocelot'));
console.log('\nBalance of BigBoss', natashaCoin.getBalanceOf('BigBoss'));
console.log('\nBalance of Otacon', natashaCoin.getBalanceOf('Otacon'));
console.log('\nBalance of Otacon', natashaCoin.getBalanceOf('Mantis'));
//
//console.log(JSON.stringify(natashaCoin, null, 4));
