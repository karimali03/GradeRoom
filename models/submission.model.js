const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

// Submission Schema
const submissionSchema = new Schema({
    id: {
        type: String,
        default: uuidv4, 
        unique: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    feedback: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


// Create a new submission
submissionSchema.statics.createSubmission = async function(submissionData) {
    const submission = new this(submissionData);
    await submission.save();
    return submission;
};

// Get all submissions
submissionSchema.statics.getAllSubmissions = async function() {
    return await this.find().populate('task').populate('student');
};

// Get a submission by ID
submissionSchema.statics.getSubmissionById = async function(submissionId) {
    return await this.findById(submissionId).populate('task').populate('student');
};

// Update a submission by ID
submissionSchema.statics.updateSubmissionById = async function(submissionId, updateData) {
    return await this.findByIdAndUpdate(submissionId, updateData, { new: true });
};

// Delete a submission by ID
submissionSchema.statics.deleteSubmissionById = async function(submissionId) {
    return await this.findByIdAndDelete(submissionId);
};

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
