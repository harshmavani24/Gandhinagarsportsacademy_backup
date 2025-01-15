const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    booked_by:{ type: String,enum:['Manager','Admin','User'], required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    amount:{ type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {type:Boolean, default: true},
    user_id : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id:{ type: Schema.Types.ObjectId, ref: 'Details_TGS', required: true },
    played:{type: Boolean, default: false},
});
module.exports = mongoose.model('Turf', querySchema);
