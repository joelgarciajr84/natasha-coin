let natasha = require('../natasha.js');
class Transaction{
   constructor(from, to, amount){
       this.from = from;
       this.to = to;
       this.amount = amount;
   }
}
natasha.createTransaction(new Transaction('Snake', 'Ocelot', 500));
console.log(natasha);
