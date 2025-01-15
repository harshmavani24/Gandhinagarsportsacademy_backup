const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    mobile_no: { type: Number, required: true },
    booked_by:{ type: String,enum:['Manager','Admin','User'], required: true,default:'User' },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    amount:{ type: Number, required: true },
    ground:{type:String,enum:['GROUND-A','GROUND-B'],required: true},
    payment_method: { type: String},
    payment_status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {type:Boolean, default: true},
    description: {type: String},
    advance: {type: Number, default: 0},
    leftover:{type:Number,default:0},
    advpaymentmode:{type:String},
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    plan_id:{ type: Schema.Types.ObjectId, ref: 'Details_TGS', required: true },
    started:{type: Boolean, default: false},
    ended:{type: Boolean, default: false},
});
const GroundSchema = mongoose.models.GroundSchema || mongoose.model('Ground', querySchema);

module.exports = GroundSchema;