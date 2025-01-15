const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    name: { type: String, required: true } ,
    event_logo: { type: Buffer, required: true },  // Binary data of the image
    contentType: { type: String, required: true },
    event_date:{ type: Date, required: true },
    location: { type: String, required: true },
    event_fee:{ type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {type:Boolean, default: true}
});
module.exports = mongoose.model('Events', querySchema);
