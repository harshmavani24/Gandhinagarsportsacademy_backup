const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    email: { type: String, required: true },
    mobile_no: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Queries', querySchema);
