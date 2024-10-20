const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

// Task Schema
const taskSchema = new Schema({
    id: {
    type: String,
    default: uuidv4, 
    unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    }
  }, { timestamps: true });



// General method to create a task
taskSchema.statics.createTask = async function (taskData) {
  const task = new this(taskData);
  // Save the user to the database
  await task.save();
  return task;
};


// General method to retrieve all users
taskSchema.statics.getAllTasks = async function () {
 return await this.find();
};



// General method to retrieve a task by ID
taskSchema.statics.getTaskById = async function (taskId) {
 return await this.findOne( { id:  taskId } );
};

// General method to update a task
taskSchema.statics.updateTaskById = async function ( id , updateData) {
 return await this.updateOne({ id: id }, updateData);
};

// General method to delete a user
taskSchema.statics.deleteTask = async function (taskId) {
 return await this.deleteOne({ id: taskId });
};



const Task = mongoose.model('Task', taskSchema);

module.exports = Task;