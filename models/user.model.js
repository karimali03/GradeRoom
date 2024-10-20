const mongoose = require('mongoose');
const bcrypt = require("../utils/bcrypt");
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');


// User Schema
const userSchema = new Schema({
  id: {
    type: String,
    default: uuidv4, 
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Teacher', 'Student'],
    default: 'Student' 
  }
}, { timestamps: true });


// General method to create a user
userSchema.statics.createUser = async function (userData) {
      const user = new this(userData);
      // Save the user to the database
      await user.save();
      return user;
};
  
 
 // General method to retrieve all users
 userSchema.statics.getAllUsers = async function () {
     return await this.find( {} , { password: 0 });
 };
 
 
 // General method to retrieve all users
 userSchema.statics.getAllUsersByRole = async function (role) {
     return await this.find({role : role}, { password: 0 });
 };
 
 // General method to retrieve a user by ID
 userSchema.statics.getUserById = async function (userId) {
     return await this.findOne( { id:  userId } , { password: 0 });
 };
 
 // General method to update a user
 userSchema.statics.updateUserById = async function ( id , updateData) {
     return await this.updateOne({ id: id }, updateData);
 };
 
 // General method to delete a user
 userSchema.statics.deleteUser = async function (userId) {
     return await this.deleteOne({ id: userId });
 };
 
 userSchema.statics.getUserByemail = async function (email) {
     return await this.findOne({ email });
 }
 
 
 userSchema.statics.verifyEmail = async function (id) {
     return await this.updateOne({ id: id }, { isVerified: true });
 }
 
 userSchema.methods.comparePassword = async function ( password ) {
     const isMatch = bcrypt.comparePassword(password , this.password);
     return isMatch;
 }
 
 
const User = mongoose.model('User', userSchema);

module.exports = User;