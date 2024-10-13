const mongoose = require("mongoose");
const bcrypt = require("../utils/bcrypt");

const userBaseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified : { type: Boolean, default: false},
    password: { type: String, required: true },
}, { discriminatorKey: 'role' }); // Specify the discriminator key


// General method to create a user
userBaseSchema.statics.createUser = async function (userData) {
    const newUser = new this(userData);
    await newUser.save();
    return newUser;
};

// General method to retrieve all users
userBaseSchema.statics.getAllUsers = async function () {
    return await this.find( {} , { password: 0 });
};


// General method to retrieve all users
userBaseSchema.statics.getAllUsersByRole = async function (role) {
    return await this.find({role : role}, { password: 0 });
};

// General method to retrieve a user by ID
userBaseSchema.statics.getUserById = async function (userId) {
    return await this.findById(userId, { password: 0 });
};

// General method to update a user
userBaseSchema.methods.updateUserById = async function (updateData) {
    return await this.constructor.updateOne({ _id: this._id }, updateData);
};

// General method to delete a user
userBaseSchema.statics.deleteUser = async function (userId) {
    return await this.deleteOne({ _id: userId });
};

userBaseSchema.statics.getUserByemail = async function (email) {
    return await this.findOne({ email });
}


userBaseSchema.statics.verifyEmail = async function (id) {
    return await this.updateOne({ _id: id }, { isVerified: true });
}

userBaseSchema.methods.comparePassword = async function ( password ) {
    const isMatch = bcrypt.comparePassword(password , this.password);
    return isMatch;
}




// Create the User model based on the base schema
const User = mongoose.model('User', userBaseSchema);

module.exports = User;