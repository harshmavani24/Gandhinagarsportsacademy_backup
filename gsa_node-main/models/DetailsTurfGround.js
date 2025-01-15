const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    time_hr: {type: Number, required: true},
    time_min: {type: Number, required: true},
    category: {type: String, enum: ['TURF', 'GROUND-A','GROUND-B'], required: true},
    sport: {type: String, enum: ['Cricket', 'Football'], required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    active: {type: Boolean, default: true},
    createdOn: {type: Date, default: Date.now}
})
module.exports = mongoose.model('Details_TG', imageSchema);
