const DetailsTG = require('../models/DetailsTurfGround');
const Status=require('../models/Status');
const CryptoJS = require('crypto-js');
const Images = require("../models/TurfImages");
const GroundBooking = require("../models/Ground");
const User = require("../models/user");
const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const bal_id= "677ba181a9f86714ba5b860b"

const getActiveDetailsGround = async (req, res) => {
    try {
        const result = await Status.findOne({ name: 'GROUND' }); // Use findOne to get a single document
        let status;

        if (result && result.active) {  // Check if result exists and active is true
            status = "ACTIVE";
        } else {
            status = "INACTIVE";
        }

        // console.log("Backend Status:", status);  // Log status before encryption
        const data = CryptoJS.AES.encrypt(status.toString(), "FetchGroundActiveStatus").toString();
        // console.log("Encrypted Status:", data);  // Log encrypted status

        res.status(200).json({ "acstatus": data });  // Ensure the response has acstatus
    } catch (error) {
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
const getImages = async (req, res) => {
    try {
        // Fetch images where the active field is true
        const images = await Images.find({ active: true }).sort({uploadedAt:-1}).limit(5); // Ensure we only fetch active images
        res.json(images.map(img => ({
            id: img._id,
            title: img.title,
            description: img.description,
            contentType: img.contentType,
            data: img.data.toString('base64')  // Convert binary data to base64 string
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images' });
    }
};


const getBookings=async (req,res)=>{
    try {
        const currentDate = new Date();

        // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
        const bookings = await GroundBooking.find();

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const MarkAsPaid = async (req, res) => {

    const {userid,id,method}=req.body;

    try{
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const booking_detail=await GroundBooking.findById(id);
        if (!booking_detail) {
            return res.status(200).json("Not Found");
        }
        else{
            const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
        if (!balance1) {
            return res.status(404).json("Balance record not found");
        }

        const bal = balance1.balance;
        let balance_after_transaction, balance_before_transaction;
            if (booking_detail.payment_status=='Paid'){
                return res.status(200).json("Payment Status Already Paid");
            }
            else if(booking_detail.payment_status=='Partial'){
                balance_after_transaction = Number(bal) + Number(booking_detail.leftover);
                balance_before_transaction = bal;
                balance1.balance = balance_after_transaction;

                const newTrans = new Transaction({
                    amt_in_out: "IN",
                    amount:Number(booking_detail.leftover),
                    description: "GROUND_BOOKING_" + booking_detail.ground + "_" + booking_detail.name,
                    balance_before_transaction,
                    method,
                    balance_after_transaction,
                    identification:"GROUND_BOOKING_"+booking_detail._id.toHexString()
            })
            await newTrans.save();
                await balance1.save();
                booking_detail.leftover=0;
                booking_detail.payment_status="Paid";
                await booking_detail.save();

                res.status(200).json({message:"Marked As Paid"})
            }
            else if(booking_detail.payment_status=='Pending'){
                balance_after_transaction = Number(bal) + Number(booking_detail.amount);
                balance_before_transaction = bal;
                balance1.balance = balance_after_transaction;

                const newTrans = new Transaction({
                    amt_in_out: "IN",
                    amount:Number(booking_detail.amount),
                    description: "GROUND_BOOKING_" + booking_detail.ground + "_" + booking_detail.name,
                    balance_before_transaction,
                    method,
                    balance_after_transaction,
                    identification:"GROUND_BOOKING_"+booking_detail._id.toHexString()
            })
            await newTrans.save();
                await balance1.save();
                booking_detail.leftover=0;
                booking_detail.payment_status="Paid";
                await booking_detail.save();

                res.status(200).json({message:"Marked As Paid"})
            }
        }
    }catch (error){
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({message: 'Server error'});
    }

}

const BookingTransactions = async (req, res) => {
    const {userid,id}=req.body;

    try {
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(401).json("Not Found");
        }
        const booking_detail = await GroundBooking.findById(id);
        if (!booking_detail) {
            return res.status(402).json("Not Found");
        }
        const transactions=await Transaction.find({identification: "GROUND_BOOKING_"+id})
        console.log(transactions)
        return res.status(200).json(transactions);
    }
    catch (error){
        console.log(error)
        res.status(500).json({message:"SERVER ERROR"})
    }
}


module.exports = {BookingTransactions,MarkAsPaid,getActiveDetailsGround,getImages ,getBookings};
