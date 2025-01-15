const DetailsTG = require('../models/DetailsTurfGround');
const DetailsAcademy = require('../models/DetailsAcademy');
const Status = require('../models/Status');
const CryptoJS = require('crypto-js');
const GroundBooking = require('../models/Ground');
const Ground = require('../models/Ground');
const User = require("../models/user");
const Attendance = require("../models/Attendance");
const Academy = require("../models/Academy");
const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const getActivePlans = async (req, res) => {
    try {
        // Fetch details with specific fields to return
        const result = await DetailsTG.find({
            active: true,
            $or: [{
                category: 'GROUND-A'
            }, {
                category: 'GROUND-B'
            }]
        }, {
            _id: 1,
            name: 1,
            amount: 1,
            time_hr: 1,
            time_min: 1,
            category: 1,
            sport: 1,
            from: 1,
            to: 1
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching default price:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const getUpcomingBookings = async (req, res) => {
    try {
        const currentDate = new Date();

        // Fetch only selected fields: `_id`, `name`, `booked_by`, `start_date`, `end_date`
        const bookings = await GroundBooking.find({
            start_date: {
                $gt: currentDate
            },
            status: true
        }).select('start_date end_date');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        const result1 = await User.findById(userId);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        const bookings = await GroundBooking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const getAllPlans = async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        const result1 = await User.findById(userId);
        if (!result1) {
            return res.status(200).json("Not Found");
        }
        // Fetch details with specific fields to return
        const result = await DetailsTG.find({
            $or: [{
                category: 'GROUND-A'
            }, {
                category: 'GROUND-B'
            }]
        }, {
            _id: 1,
            name: 1,
            amount: 1,
            time_hr: 1,
            time_min: 1,
            category: 1,
            sport: 1,
            from: 1,
            to: 1,
            active: 1
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching default price:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const changeStatus = async (req, res) => {
    try {
        const {
            status
        } = req.body; // status can be 'active', 'ended', 'inactive'
        const updatedBooking = await Ground.findByIdAndUpdate(req.params.id, {
            status
        }, {
            new: true
        });

        res.json({
            message: 'Booking status updated.',
            updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating booking status.'
        });
    }
}

const updateBooking = async (req, res) => {
    try {
        const {
            name,
            mobile_no,
            booked_by,
            date,
            amount,
            ground,
            payment_status,
            plan_id,
            payment_method,
            status,
            description,
            advance,
            advpaymentmode,
            started,
            ended,
        } = req.body;
        const updatedBooking = await Ground.findByIdAndUpdate(
            req.params.id, {
                name,
                mobile_no,
                leftover: amount - advance,
                booked_by,
                date,
                amount,
                ground,
                payment_status,
                plan_id,
                payment_method,
                status,
                description,
                advance,
                advpaymentmode,
                started,
                ended,
            }, {
                new: true
            }
        );

        res.json({
            message: 'Booking details updated.',
            updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating booking details.'
        });
    }
}
const bal_id = "677ba181a9f86714ba5b860b"
const newBooking = async (req, res) => {
    try {
        const {
            name,
            mobile_no,
            booked_by,
            start_date,
            end_date,
            amount,
            ground,
            payment_status,
            plan_id,
            payment_method,
            status,
            description,
            advance,
            advpaymentmode,
            started,
            ended,
        } = req.body;
        const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
        if (!balance1) {
            return res.status(404).json("Balance record not found");
        }

        const bal = balance1.balance;
        let balance_after_transaction, balance_before_transaction;
        if (payment_status == "Pending") {
            const newBooking1 = new Ground({
                name,
                mobile_no,
                booked_by: 'Manager',
                start_date,
                end_date,
                amount,
                ground,
                payment_method,
                payment_status,
                plan_id,
                status,
                description,
                advance,
                advpaymentmode,
                leftover: amount - advance,
                started,
                ended // Active status by default
            });

            await newBooking1.save();
            console.log(newBooking)
            return res.json({
                message: 'Booking created successfully!',
                booking: newBooking
            });

        } else if (payment_status == "Paid") {
            balance_after_transaction = Number(bal) + Number(amount);
            balance_before_transaction = bal;

            const newBooking1 = new Ground({
            name,
            mobile_no,
            booked_by: 'Manager',
            start_date,
            end_date,
            amount,
            ground,
            payment_method,
            payment_status,
            plan_id,
            status,
            description,
            advance,
            advpaymentmode,
            leftover: amount - amount,
            started,
            ended // Active status by default
        });
            await newBooking1.save();

            console.log(newBooking1._id)
            balance1.balance = balance_after_transaction;
            await balance1.save();
            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount,
                description: "GROUND_BOOKING_" + ground + "_" + name,
                balance_before_transaction,
                method: payment_method,
                balance_after_transaction,
                identification:"GROUND_BOOKING_"+newBooking1._id.toHexString()
            })
            await newTrans.save();
        } else if (payment_status == "Partial") {
            if (Number(advance) > 0) {
                balance_after_transaction = Number(bal) + Number(advance);
                balance_before_transaction = bal;

            }
            const newBooking1 = new Ground({
            name,
            mobile_no,
            booked_by: 'Manager',
            start_date,
            end_date,
            amount,
            ground,
            payment_method,
            payment_status,
            plan_id,
            status,
            description,
            advance,
            advpaymentmode,
            leftover: amount - advance,
            started,
            ended // Active status by default
        });
            await newBooking1.save();
            console.log(newBooking1._id)
            balance1.balance = balance_after_transaction;
            await balance1.save();
            const newTrans = new Transaction({
                    amt_in_out: "IN",
                    amount: advance,
                    description: "ADV_GROUND_BOOKING_" + ground + "_" + name,
                    balance_before_transaction,
                    method: advpaymentmode,
                    balance_after_transaction,
                identification:"GROUND_BOOKING_"+newBooking1._id.toHexString()
                })
                await newTrans.save();
        }

return res.json({
            message: 'Booking created successfully!',
            booking: newBooking
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error creating booking.'
        });
    }
}

const takeAttendance = async (req, res) => {
    try {
        const {
            userid,
            rollno
        } = req.body;
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        if (!rollno) {
            console.log(1)
            return res.status(400).json({
                message: "Roll number is required."
            });
        }

        const student = await Academy.findOne({
            roll_no: rollno
        });
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const currentDate = new Date();
        const planExpiryDate = new Date(student.to);
        const daysLeft = Math.ceil((planExpiryDate - currentDate) / (1000 * 60 * 60 * 24));

        const attendanceExists = await Attendance.findOne({
            rollno,
            createdOn: {
                $gte: new Date(currentDate.setHours(0, 0, 0, 0))
            },
        });

        if (attendanceExists) {
            console.log(2)
            return res.status(201).json({
                message: "Attendance already marked for today."
            });
        }

        if (daysLeft < 0) {
            console.log(3)
            return res.status(400).json({
                message: "Plan expired. Please renew to mark attendance."
            });
        } else if (daysLeft <= 3) {
            const attendanceRecord = new Attendance({
                rollno,
                active: true
            });
            await attendanceRecord.save();
            return res.status(200).json({
                message: `Attendance marked successfully. Note: Plan is expiring in ${daysLeft} day(s).`,
                attendanceDate: attendanceRecord.createdOn,
            });
        } else {
            const attendanceRecord = new Attendance({
                rollno,
                active: true
            });
            await attendanceRecord.save();
            return res.status(200).json({
                message: "Attendance marked successfully.",
                attendanceDate: attendanceRecord.createdOn,
            });
        }
    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({
            message: "An error occurred while marking attendance."
        });
    }
};

const getAttendance = async (req, res) => {
    try {
        const {
            userid,
            date
        } = req.body;

        // Verify user
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        // Prepare date range
        const queryDate = date ? new Date(date) : new Date();
        queryDate.setHours(0, 0, 0, 0); // Start of the day
        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Fetch attendance records for the day
        const attendanceRecords = await Attendance.find({
            createdOn: {
                $gte: queryDate,
                $lt: nextDay
            },
        });

        // Find present students
        const presentStudents = await Promise.all(
            attendanceRecords.map(async (record) => {
                const student = await Academy.findOne({
                    roll_no: record.rollno,
                    active: true
                });
                if (!student) {
                    console.warn(`No active student found for roll number: ${record.rollno}`);
                    return null; // Return null for unmatched records
                }
                return {
                    name: student.name,
                    rollno: student.roll_no,
                    expiringDate: student.to.toDateString(),
                };
            })
        );

        // Filter out null values (unmatched records)
        const filteredPresentStudents = presentStudents.filter(Boolean);

        // Find all active students and identify absentees
        const totalStudents = await Academy.find({
            active: true
        });
        const absentStudents = totalStudents.filter(
            (student) => !filteredPresentStudents.some((present) => present.rollno === student.roll_no)
        );

        // Send response
        res.status(200).json({
            date: queryDate.toDateString(),
            presentStudents: filteredPresentStudents,
            absentStudents: absentStudents.map((student) => ({
                name: student.name,
                rollno: student.roll_no,
                expiringDate: student.to.toDateString(),
            })),
        });
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the attendance summary."
        });
    }
};

const moment = require('moment');
const mongoose = require("mongoose");
const updateTrainees = async (req, res) => {
    try {
        const {
            userid
        } = req.body;
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }
        // Calculate yesterday's date
        const yesterday = moment().subtract(0, 'days').startOf('day').toDate();

        // Find and update all records where the 'to' date is before yesterday and 'active' is true
        const result = await Academy.updateMany({
            to: {
                $lt: yesterday
            },
            active: true
        }, {
            $set: {
                active: false
            }
        });

        // Log the result of the update
        if (result.modifiedCount > 0) {
            console.log(`${result.modifiedCount} record(s) updated to inactive.`);
        } else {
            console.log("No records found to update.");
        }
    } catch (error) {
        console.error("Error updating expired plans:", error);
    }
}

const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    }, // 10 MB limit
});
const newTrainee = async (req, res) => {
    try {
        const {
            name,
            father,
            dob,
            address,
            phone,
            plan_id,
            amount,
            occupation,
            currentClass,
            schoolName,
            dateAndPlace
        } = req.body;

        // Get files from request
        // Generate roll number
        let rollno = await Academy.countDocuments();
        const roll_no = rollno + 20250001;

        // Fetch plan details
        const result = await DetailsAcademy.findById(plan_id);
        if (!result) {
            return res.status(404).json({
                message: 'Plan not found.'
            });
        }

        const session = result.name;
        const plan_time = result.plan_limit + " Days";
        const today = moment();
        const firstDate = today.add(1, 'days');
        const secondDate = moment(today).add(result.plan_limit, 'days');

        // Save to the database
        const newT = new Academy({
            roll_no,
            name,
            father,
            amount,
            session,
            from: today,
            to: secondDate,
            plan_time,
            occupation,
            address,
            phone,
            dob,
            name_of_school: schoolName,
            current_class: currentClass,
            photo: photoBuffer,
            signature: traineeSignatureBuffer,
            date_and_place: dateAndPlace,
            father_signature: fathersignatureBuffer,
            plan_id: new mongoose.Types.ObjectId(plan_id),
        });

        await newT.save();
        res.json({
            message: 'Trainee created successfully!'
        });
    } catch (error) {
        console.error("Error creating trainee:", error);
        res.status(500).json({
            message: 'Server error.'
        });
    }
};
module.exports = {
    newTrainee,
    newBooking,
    updateBooking,
    changeStatus,
    updateTrainees,
    getAttendance,
    takeAttendance,
    getAllBookings,
    getActivePlans,
    getAllPlans,
    getUpcomingBookings
};