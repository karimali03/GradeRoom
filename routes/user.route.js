const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');


// register
router.post('/signup', authController.signup );
router.get('/verify-email' , authController.verifyEmail );
// forget password
router.post('/forget-password' , authController.forgetPassword );
router.post('/reset-password' , authController.resetPassword );
// sign in 
router.post('/signin' , authController.signin);

router.post('/change-password' ,authController.validateAuth , authController.changePassword );
router.get('/', authController.validateAuth,authController.restrictTo("Teacher"),UserController.getAllUsers);
router.get('/:id',authController.validateAuth,authController.restrictTo("Teacher","User"),UserController.getUserById);
router.put('/:id',authController.validateAuth,authController.restrictTo("User"),UserController.updateUser );
router.delete('/:id',authController.validateAuth,authController.restrictTo("Teacher","User"),UserController.deleteUser);




module.exports = router;
