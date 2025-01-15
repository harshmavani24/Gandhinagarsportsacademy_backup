const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const balanceSchema = new mongoose.Schema({
    balance: {type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
});
const BalanceSchema = mongoose.models.BalanceSchema || mongoose.model('Balance', balanceSchema);

module.exports = BalanceSchema;