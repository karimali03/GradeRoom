const express = require('express');
const SubmissionController = require('../controllers/submission.controller');
const AuthController = require('../controllers/auth.controller');
const upload = require('../middlewares/upload'); // Multer configuration
const router = express.Router();

// Create a new submission
router.post('/',AuthController.validateAuth,AuthController.verifiyUser,AuthController.restrictTo("Student")
,upload.single('pdf'),SubmissionController.createSubmission);

// Get all submissions
router.get('/', AuthController.validateAuth,AuthController.verifiyUser,AuthController.restrictTo("Student")
, SubmissionController.getAllSubmissions);

// Get a submission by ID
router.get('/:id', AuthController.validateAuth,AuthController.verifiyUser,AuthController.restrictTo("Student")
, SubmissionController.getSubmissionById);

// Update a submission by ID
router.put('/:id', AuthController.validateAuth,AuthController.verifiyUser,AuthController.restrictTo("Student")
, SubmissionController.updateSubmission);

// Delete a submission by ID
router.delete('/:id', AuthController.validateAuth,AuthController.verifiyUser,AuthController.restrictTo("Student")
, SubmissionController.deleteSubmission);

module.exports = router;
