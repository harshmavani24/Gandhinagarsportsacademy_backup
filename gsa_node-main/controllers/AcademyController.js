const DetailsTG = require('../models/DetailsAcademy');
const Status=require('../models/Status');
const CryptoJS = require('crypto-js');
const User=require('../models/user');
const mongoose = require('mongoose');
const Students = require('../models/Academy');

const getActiveDetailsAcademy = async (req, res) => {
    try {
        const result = await Status.findOne({ name: 'ADMISSION' }); // Use findOne to get a single document
        let status;

        if (result && result.active) {  // Check if result exists and active is true
            status = "ACTIVE";
        } else {
            status = "INACTIVE";
        }

        // console.log("Backend Status:", status);  // Log status before encryption
        const data = CryptoJS.AES.encrypt(status.toString(), "FetchAcademyActiveStatus").toString();
        // console.log("Encrypted Status:", data);  // Log encrypted status

        res.status(200).json({ "acstatus": data });  // Ensure the response has acstatus
    } catch (error) {
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getActivePlans = async (req, res) => {
    try {
        const result = await DetailsTG.find({ active: true }); // Use findOne to get a single document

        res.status(200).json(result);  // Ensure the response has acstatus
    } catch (error) {
        console.error('Error Fetching Status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAllPlans = async (req, res) => {
    try {
        const {userId} = req.body;
        const user_id =new mongoose.Types.ObjectId(userId);
        const result1 = await User.findOne({ _id: user_id, role: {$in:['Manager','Admin'] }});
        if (!result1){
            return res.status(200).json("Not Found");
        }
        const result = await DetailsTG.find(); // Use findOne to get a single document

        return res.status(200).json(result);  // Ensure the response has acstatus
    } catch (error) {
        console.error('Error Fetching Status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const getAllStudents = async (req, res) => {
    try {
        const {userId} = req.body;
        const user_id =new mongoose.Types.ObjectId(userId);
        const result1 = await User.findOne({ _id: user_id, role: {$in:['Manager','Admin'] }});
        if (!result1){
            return res.status(200).json("Not Found");
        }
        const result = await Students.find(); // Use findOne to get a single document

        return res.status(200).json(result);  // Ensure the response has acstatus
    } catch (error) {
        console.error('Error Fetching Status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const AddPlan = async (req, res) => {
    try {
        const plan = new DetailsTG(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const UpdatePlan = async (req, res) => {
    try {
        const updatedPlan = await DetailsTG.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ error: 'Plan not found' });
        res.json(updatedPlan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const ChangePlanStatus =async (req, res) => {
    try {
        const plan = await DetailsTG.findById(req.params.id);
        if (!plan) return res.status(404).json({ error: 'Plan not found' });
        plan.active = !plan.active;
        await plan.save();
        res.json(plan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {ChangePlanStatus,UpdatePlan,AddPlan,getAllStudents,getAllPlans,getActivePlans,getActiveDetailsAcademy };
