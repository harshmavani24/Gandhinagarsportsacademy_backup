const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    email: { type: String, required: true },
    mobile_no: { type: String, required: true },
    registeredOn: { type: Date, default: Date.now },
    payment_done:{type:Boolean, default: false},
    event_id : { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    user_id : { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('Event_Participants', querySchema);
