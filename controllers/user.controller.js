const User = require('../models/user.model');
const asyncFun = require('../middlewares/async.function');


class UserController  {
    static getAllUsers =  asyncFun ( async (req, res) => {
            const users = await User.getAllUsers();
            res.send({ message : "OK" , data:users});
    });

    static getUserById = asyncFun( async (req, res) => {
            const user = await User.getUserById( req.params.id , {password:0} );
            if(user) res.send({ message: "user found", data : user });
            else res.send({ message: "user not found" , data : null}); 
    });

    static updateUser = asyncFun( async (req, res) => {
            if(req.body.email){
                const isExist = await User.getUserByemail(req.body.email);
                if(isExist) 
                return res.status(400).send({ message: "email cannot be used"});
            }
            const updatedUser = await User.updateUserById(req.params.id, req.body );
            res.send({
                    message: "user is updated",
                    data: updatedUser
            });
    });
    static deleteUser = asyncFun(async (req, res) => {
            const user = await User.deleteUser(req.params.id);
            if(user) res.status(204).send({ message: "user is deleted", data: user });
            else res.status(400).send({ message: "user not found"});
    });

}


module.exports = UserController;