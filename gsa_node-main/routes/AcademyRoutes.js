const express = require('express');
const {getActiveDetailsAcademy,UpdatePlan, getActivePlans,getAllPlans,getAllStudents, AddPlan, ChangePlanStatus} = require('../controllers/AcademyController');

const router = express.Router();

router.post('/active-plans', getActivePlans);
router.post('/students', getAllStudents);
router.post('/all-plans', getAllPlans);
router.post('/add-plan', AddPlan);
router.put('/update-plan/:id', UpdatePlan);
router.patch('/update-plan-status/:id/toggle', ChangePlanStatus);
router.get('/status', getActiveDetailsAcademy);

const Academy = require('../models/Academy');

// Add new trainee
router.post('/trainee', async (req, res) => {
    try {
        const trainee = new Academy(req.body);
        await trainee.save();
        res.status(201).send(trainee);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Update trainee
router.put('/trainee/:id', async (req, res) => {
    try {
        const trainee = await Academy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(trainee);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Toggle active status
router.patch('/trainee/:id/toggle', async (req, res) => {
    try {
        const trainee = await Academy.findById(req.params.id);
        trainee.active = !trainee.active;
        await trainee.save();
        res.send(trainee);
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message);
    }
});

// Generate ID card (mock implementation)
router.post('/trainee/:id/generate-id', async (req, res) => {
    try {
        const trainee = await Academy.findById(req.params.id);
        trainee.id_card_generated = true;
        await trainee.save();
        res.send({ message: 'ID card generated successfully.' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all trainees
router.get('/trainees', async (req, res) => {
    try {
        const trainees = await Academy.find();
        res.send(trainees);
    } catch (error) {
        res.status(400).send(error.message);
    }
});




module.exports = router;
