const jwt = require('jsonwebtoken');  
const mailService = require('../utils/mail.service');
const bcrypt = require('../utils/bcrypt');
const asyncFun = require('../middlewares/async.function');
const User = require('../models/user.model'); // assuming you have a User model


class authController {
    static signup = asyncFun(async (req, res) => {
        const { email, password } = req.body;
        const isExist = await User.getUserByemail(email);
        if (isExist) return res.status(400).send({ "message": "Email already exists" });

        req.body.password = await bcrypt.hashPassword(password);
        const newUser = await User.createUser(req.body);

        const mailer = new mailService();
        // Generate verification token (JWT)
        const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const verificationLink = `${process.env.URL}/api/v1/users/verify-email?token=${verificationToken}`;
        
        // Send verification email
        await mailer.sendVerificationEmail(email, verificationLink);

        res.status(201).send({ message: "Check your mail to verify your account", data: newUser });
    });

    static verifyEmail = asyncFun(async (req, res) => {
        try {
            const { token } = req.query;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Token verification
            const userId = decoded.userId;
            await User.verifyEmail(userId);  // Mark email as verified
            res.send({ message: 'Email verified successfully!' });
        } catch (error) {
            res.status(400).send({ message: 'Invalid or expired token' });
        }
    });

    static signin = asyncFun(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.getUserByemail(email);
        if (!user) return res.status(400).send({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.header('x-auth-token', token).send({ message: 'Sign in successful' });
    });

    static forgetPassword = asyncFun(async (req, res) => {
        const { email } = req.body;
        const user = await User.getUserByemail(email);
        if (!user) return res.status(400).send({ message: 'User not found' });

        // Generate reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const resetLink = `${process.env.URL}/api/v1/users/reset-password?token=${resetToken}`;

        const mailer = new mailService();
        await mailer.sendPasswordResetEmail(email, resetLink);
        res.send({ message: 'Password reset email sent successfully' });
    });

    static resetPassword = asyncFun(async (req, res) => {
        try {
            const { token } = req.query;
            const { password } = req.body;

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // Hash new password and update user
            const hashedPassword = await bcrypt.hashPassword(password);
            await User.updateUserById({ _id: userId, password: hashedPassword });

            res.send({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(400).send({ message: 'Invalid or expired token' });
        }
    });

    static changePassword = asyncFun(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const user = await User.getUserById(req.user._id);

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const hashedPassword = await bcrypt.hashPassword(newPassword);
        await User.updateUserById({ _id: req.user._id, password: hashedPassword });

        res.send({ message: 'Password changed successfully' });
    });
}



module.exports = authController;
