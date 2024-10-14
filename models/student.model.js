const mongoose  = require("mongoose");

const User = require("./user.model")

const studentSchema = new mongoose.Schema({
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});
const Student = User.discriminator('Student', studentSchema);


module.exports = Student;