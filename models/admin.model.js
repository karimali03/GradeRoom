const User = require("./user.model")

const adminSchema = new mongoose.Schema({
    // Admin-specific fields can be added here
});
const Admin = User.discriminator('Admin', adminSchema);


module.exports = Admin;