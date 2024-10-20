const express = require('express');
const router = express.Router();
const TaskController = require("../controllers/task.controller");
const AuthController = require("../controllers/auth.controller");

// Create a Task
router.post('/', AuthController.validateAuth,AuthController.verifiyUser,
    AuthController.restrictTo("Teacher") , TaskController.createTask );

// Get all Tasks
router.get('/', AuthController.validateAuth,AuthController.verifiyUser, TaskController.getAllTasks );

// Get a Task by ID
router.get('/:id',AuthController.validateAuth,AuthController.verifiyUser,TaskController.getTaskById);


// Update a Task by ID
router.put('/:id',AuthController.validateAuth,AuthController.verifiyUser,
    AuthController.restrictTo("Teacher") , TaskController.updateTask);

// Delete a Task by ID
router.delete('/:id',AuthController.validateAuth,AuthController.verifiyUser,
    AuthController.restrictTo("Teacher") , TaskController.deleteTask);

module.exports = router;
