const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amt_in_out: {type: String,required: true,enum:['IN','OUT']},
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    identification: {type: String},
    balance_before_transaction: {type: Number, required: true},
    balance_after_transaction: {type: Number, required: true},
    method:{type:String, required: true,default:'CASH',enum:['CASH','UPI','CARD','NET BANKING','CHEQUE','DEMAND DRAFT']},
    createdAt: { type: Date, default: Date.now },
});
const TransactionSchema = mongoose.models.TransactionSchema || mongoose.model('Transaction', transactionSchema);

module.exports = TransactionSchema;