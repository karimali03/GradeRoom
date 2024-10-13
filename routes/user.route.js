const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');



router.post('/signin' , authController.signin );

router.post('/forget-password' , authController.forgetPassword );

router.post('/reset-password' , authController.resetPassword );

router.get('/verify-email' , authController.verifyEmail );

router.post('/change-password' , authController.changePassword );

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUserById);

router.post('/signup', authController.signup );

router.put('/:id', UserController.updateUser );

router.delete('/:id', UserController.deleteUser);




module.exports = router;
