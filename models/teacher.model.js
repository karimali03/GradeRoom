const User = require("./user.model")

const teacherSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});
const Teacher = User.discriminator('Teacher', teacherSchema);


module.exports = Teacher;