const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const academySchema = new mongoose.Schema({
    roll_no: { type: String,required: true },
    name: { type: String, required: false },
    amount: { type: Number, required: false },
    session: { type: String, required: false },
    plan_time: { type: String, required: false },
    father: { type: String, required: false },
    occupation: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    dob: { type: Date, required: false },
    name_of_school: { type: String, required: false },
    current_class: { type: String, required: false },
    photo: { type: String, required: false },
    signature:{ type: String, required: false },
    date_and_place: { type: String, required: false },
    father_signature: { type: String, required: false },
    from: { type: Date, default: Date.now },
    to: { type: Date, required: false },
    payment_number: { type: Number },
    plan_id: { type: Schema.Types.ObjectId, ref: 'DetailsAcademy', required: false },
    active: { type: Boolean, default: true },
    user_id:{ type: Schema.Types.ObjectId, ref: 'User' },
    id_card_generated: { type: Boolean, default: false },
    id_card_given: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now }
});

// Middleware to generate roll_no before saving
// academySchema.pre('save', async function (next) {
//     const currentYear = new Date().getFullYear().toString();
//     const lastEntry = await this.constructor.findOne()
//         .sort({ roll_no: -1 }) // Sort by roll_no descending
//         .exec();
//
//     let newRollNo;
//
//     if (lastEntry && lastEntry.roll_no.startsWith(currentYear)) {
//         const lastRollNo = parseInt(lastEntry.roll_no.slice(4), 10); // Extract the number after the year
//         newRollNo = `${currentYear}${String(lastRollNo + 1).padStart(4, '0')}`;
//     } else {
//         newRollNo = `${currentYear}0001`; // Start fresh if no entries for the year
//     }
//
//     this.roll_no = newRollNo;
//     next();
// });

// Explicitly naming the model to avoid collisions
const Academy = mongoose.models.Academy || mongoose.model('Academy', academySchema);

module.exports = Academy;
