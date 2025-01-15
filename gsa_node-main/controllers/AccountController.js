const User=require('../models/user');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');
const bal_id="677ba181a9f86714ba5b860b"
const fetchTransactions = async (req, res) => {
    const { userid } = req.body;
    // console.log(userid);
    const result1 = await User.findById(userid);
    if (!result1) {
        return res.status(404).json("User Not Found");
    }
    // console.log(1)
    const trans = await Transaction.find();
    // console.log(trans)
    res.status(200).json(trans);
};

const fetchAccountsData = async (req,res) =>{
    const { userid } = req.body;
    // console.log(1)
    const result1 = await User.findById(userid);
    if (!result1) {
        return res.status(404).json("User Not Found");
    }
    // console.log(2)
    const bal=await Balance.findById(bal_id);
    console.log(bal)
    res.status(200).json(bal);
}

const AddNewTransaction = async (req, res) => {
    console.log("NEW TRANSACTION");
    const { userid, amt_in_out, amount,method, description } = req.body;

    try {
        // Fetch balance record
        const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
        if (!balance1) {
            return res.status(404).json("Balance record not found");
        }

        const bal = balance1.balance;
        console.log("BALANCE_FETCHED");

        let balance_after_transaction, balance_before_transaction;

        if (amt_in_out === "IN") {
            console.log("AMOUNT_IN");
            balance_after_transaction = Number(bal) + Number(amount);
            balance_before_transaction = bal;
            console.log("2_FIELDS_UPDATED");
        } else if (amt_in_out === "OUT") {
            console.log("AMOUNT_OUT");
            if (amount > bal) {
                return res.status(400).json("Amount should not be greater than Balance");
            }
            balance_after_transaction =Number(bal) - Number(amount);
            balance_before_transaction = bal;
            console.log("2_FIELDS_UPDATED");
        } else {
            console.log("INVALID_OPTION");
            return res.status(400).json("Invalid Option");
        }

        // Create and save the transaction
        const transaction = new Transaction({
            amt_in_out,
            amount,
            description,
            balance_before_transaction,
            method,
            balance_after_transaction,
        });

        console.log("DATA_LOADED");
        balance1.balance=balance_after_transaction;
        await balance1.save();
        await transaction.save();
        console.log("DATA_SAVED");

        res.status(200).json(transaction);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
};

module.exports = { fetchTransactions,fetchAccountsData,AddNewTransaction };
