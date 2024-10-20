const Task = require('../models/task.model');
const asyncFun = require('../middlewares/async.function');


class TaskController  {
    static createTask = asyncFun( async (req, res) => {
            req.body.createdBy = req.user._id;
            console.log(req.user._id);
            const newTask = await Task.createTask(req.body);
            res.status(201).send({
                "message" : "Task Created sucssesfully",
                "data" : newTask
            });
    });

    static getAllTasks = asyncFun(async (req, res) => {
           const tasks = await Task.getAllTasks();
           res.send({
            "message" : "Ok",
            "data" : tasks
           })
    });

    static getTaskById = asyncFun(async (req, res) => {
            const task = await Task.getTaskById(req.params.id);
            if (!task) return res.status(404).send({ message: 'Task not found' });
            res.status(200).send({
                message : "Task found successfully",
                data : task
            }); 
    });

    static updateTask = asyncFun(async (req, res) => {   
            const updatedTask = await Task.updateTaskById(req.params.id, req.body );
            if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
            res.status(200).send({message: "Task updated successfully", data : updatedTask});
    });

    static deleteTask = asyncFun(async (req, res) => {
            const deletedTask = await Task.deleteTask(req.params.id);
            if (!deletedTask) return res.status(404).send({ message: 'Task not found' });
            res.status(204).send({ message: 'Task deleted successfully' , data : deletedTask });
    }); 


}


module.exports = TaskController;