const express = require('express');
const { getActivePlans ,getAllBookings, getAllPlans,getUpcomingBookings,takeAttendance, getAttendance, updateTrainees,
    newTrainee
} = require('../controllers/ManagerGroundController');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const DetailsAcademy= require('../models/DetailsAcademy');
const Academy= require('../models/Academy');
router.post('/all-plans', getAllPlans);
router.post('/all-bookings', getAllBookings);
const moment = require('moment');
router.post('/take-attendance', takeAttendance);
router.post('/trainee-attendance', getAttendance);

router.post('/update-trainee-student', updateTrainees);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
router.post("/add-new-trainee", upload.fields([
    { name: "photo" },
    { name: "traineeSignature" },
    { name: "fatherSignature" }
]), async (req, res) => {
    try {
        const { name, father, dob, address, phone, plan_id, amount, occupation, currentClass, schoolName, dateAndPlace } = req.body;

        const rollno = await Academy.countDocuments();
        const roll_no = rollno + 20250001;

        const planDetails = await DetailsAcademy.findById(plan_id);
        if (!planDetails) return res.status(404).send("Plan not found");
const result = await DetailsAcademy.findById(plan_id);
        if (!result) {
            return res.status(404).json({ message: 'Plan not found.' });
        }
         const session = result.name;
        const plan_time = result.plan_limit + " Days";
        const today = moment();
        const firstDate = today.add(1, 'days');
        const secondDate = moment(today).add(result.plan_limit, 'days');
        const newTrainee = new Academy({
            roll_no,
            name,
            father,
            dob,
            address,
            session,
            from: today,
            to: secondDate,
            phone,
            plan_id,
            amount,
            occupation,
            current_class:currentClass,
            name_of_school:schoolName,
            date_and_place:dateAndPlace,
            photo: req.files.photo[0].filename,
            signature: req.files.traineeSignature[0]?.filename,
            father_signature: req.files.fatherSignature[0]?.filename,

        });

        await newTrainee.save();
        res.send("Trainee added successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
module.exports = router;
