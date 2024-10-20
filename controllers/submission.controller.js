const Submission = require('../models/submission.model');
const asyncFun = require('../middlewares/async.function');

class SubmissionController {
    // Create a new submission (Students submit their task)
    static createSubmission = asyncFun(async (req, res) => {
    
        // Check if file is uploaded
        if (!req.file) {
                return res.status(400).send({ message: 'No file uploaded. Please upload a PDF.' });
        }
        // Add the file URL (or path) to the submission
        req.body.student = req.user._id; // Assuming req.user contains the authenticated student's ID
        req.body.fileUrl = req.file.path; // Path where the file is stored locally
        
        const newSubmission = await Submission.createSubmission(req.body);
        res.status(201).send({
            message: "Submission created successfully",
            data: newSubmission
        });
    });

    // Get all submissions (Admin/Teacher can view all submissions)
    static getAllSubmissions = asyncFun(async (req, res) => {
        const submissions = await Submission.getAllSubmissions();
        res.status(200).send({
            message: "All submissions retrieved successfully",
            data: submissions
        });
    });

    // Get a submission by ID
    static getSubmissionById = asyncFun(async (req, res) => {
        const submission = await Submission.getSubmissionById(req.params.id);
        if (!submission) {
            return res.status(404).send({ message: 'Submission not found' });
        }
        res.status(200).send({
            message: "Submission retrieved successfully",
            data: submission
        });
    });

    // Update a submission by ID
    static updateSubmission = asyncFun(async (req, res) => {
        const updatedSubmission = await Submission.updateSubmissionById(req.params.id, req.body);
        if (!updatedSubmission) {
            return res.status(404).send({ message: 'Submission not found' });
        }
        res.status(200).send({
            message: "Submission updated successfully",
            data: updatedSubmission
        });
    });

    // Delete a submission by ID
    static deleteSubmission = asyncFun(async (req, res) => {
        const deletedSubmission = await Submission.deleteSubmissionById(req.params.id);
        if (!deletedSubmission) {
            return res.status(404).send({ message: 'Submission not found' });
        }
        res.status(200).send({ message: 'Submission deleted successfully' });
    });
}

module.exports = SubmissionController;
