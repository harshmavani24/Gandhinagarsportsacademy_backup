const DetailsTG = require('../models/DetailsTurfGround');
const Status=require('../models/Status');
const CryptoJS = require('crypto-js');
const Images = require('../models/TurfImages');
const TurfBooking = require('../models/Turf');
const jwt = require('jsonwebtoken');
// Controller function to fetch default 1-hour price for time ranges
const getDefaultOneHourPrice = async (req, res) => {
    try {
        const result = await DetailsTG.find({time_hr: 1,time_min:0, active: true ,category:'TURF',sport:'Cricket'});
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUpcomingBookings = async (req, res) => {
    try {
        const currentDate = new Date();

        // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
        const bookings = await TurfBooking.find(
            { start_date: { $gt: currentDate } }
        ).select('start_date end_date');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getDetailsPrice = async (req, res) => {
    try {
        const result = await DetailsTG.find({ active: true ,category:'TURF',sport:'Cricket'});
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching default price:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getActiveDetailsTurf = async (req, res) => {
    try {
        const result = await Status.findOne({ name: 'TURF' }); // Use findOne to get a single document
        let status;

        if (result && result.active) {  // Check if result exists and active is true
            status = "ACTIVE";
        } else {
            status = "INACTIVE";
        }

        // console.log("Backend Status:", status);  // Log status before encryption
        const data = CryptoJS.AES.encrypt(status.toString(), "FetchTurfActiveStatus").toString();
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

const BookTurf=async (req,res) =>{
    try{
        let {plan_id,user_id,booking_form,booked_by,token}=req.body;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifies the signature
        const { id, email, mobile } = decodedToken; // Extract relevant fields from the token

        plan_id = CryptoJS.AES.decrypt(
            plan_id,
            "71f51aa9785d29a3b1d4a76e9f32c4a908a914e5cdb6f20a5e362cd4bbd86b7f400f6c1820a97856b7f400fef12ab08c7f630ec15b3d866a148634b43dfe3dc1820a978564e896db2"
        ).toString(CryptoJS.enc.Utf8);
        // Optional: You can validate the extracted user ID with `user_id` if needed
        if (id !== user_id) {
            return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
        }
    }
    catch (error){
        res.status(500).json({ message: 'Error fetching images' });
    }
}


module.exports = { BookTurf,getUpcomingBookings,getActiveDetailsTurf,getDefaultOneHourPrice,getDetailsPrice ,getImages};
