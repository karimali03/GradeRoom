const jwt = require('jsonwebtoken');  
const mailService = require('../utils/mail.service');
const bcrypt = require('../utils/bcrypt');
const asyncFun = require('../middlewares/async.function');
const User = require('../models/user.model');  
// Helper function to sign JWT tokens
const signToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

class authController {
    // Signup handler
    static signup = asyncFun(async (req, res) => {
        const { email, password } = req.body;

        const isExist = await User.getUserByemail(email);
        if (isExist) return res.status(400).send({ message: "Email already exists" });

        req.body.password = await bcrypt.hashPassword(password);
        const newUser = await User.createUser(req.body);

        const mailer = new mailService();
        // Generate verification token (JWT)
        const verificationToken = signToken(newUser.id);
        const verificationLink = `${process.env.URL}/api/v1/user/verify-email?token=${verificationToken}`;
        
        // Send verification email
        await mailer.sendVerificationEmail(email, verificationLink);

        res.status(201).send({ message: "Check your email to verify your account", data: newUser });
    });

    // Email verification handler
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

    // Sign-in handler
    static signin = asyncFun(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.getUserByemail(email);
        if (!user) return res.status(400).send({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const token = signToken(user.id, user.role);
        res.header('x-auth-token', token).send({ message: 'Sign in successful' });
    });

    // Forgot password handler
    static forgetPassword = asyncFun(async (req, res) => {
        const { email } = req.body;

        const user = await User.getUserByemail(email);
        if (!user) return res.status(400).send({ message: 'User not found' });

        // Generate reset token
        const resetToken = signToken(user.id);
        const resetLink = `${process.env.URL}/api/v1/user/reset-password?token=${resetToken}`;

        const mailer = new mailService();
        await mailer.sendPasswordResetEmail(email, resetLink);

        res.send({ message: 'Password reset email sent successfully' });
    });

    // Reset password handler
    static resetPassword = asyncFun(async (req, res) => {
        try {
            const { token } = req.query;
            const { password } = req.body;

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // Hash new password and update user
            const hashedPassword = await bcrypt.hashPassword(password);
            await User.updateUserById(userId, { password: hashedPassword });

            res.send({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(400).send({ message: 'Invalid or expired token' });
        }
    });

    // Change password handler
    static changePassword = asyncFun(async (req, res) => {
        const { oldPassword, newPassword } = req.body;

        const user = await User.getUserById(req.user.id);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const hashedPassword = await bcrypt.hashPassword(newPassword);
        await User.updateUserById(req.user.id, { password: hashedPassword });

        res.send({ message: 'Password changed successfully' });
    });

    static restrictTo = (...roles) => {
        return asyncFun(async (req, res, next) => {
            console.log(roles);
            console.log(req.user.role);
            if ( !roles.includes(req.user.role) && !(roles.includes("User") &&  req.user.id === req.params.id )) {
                return res.status(403).send({ 
                    message: "You do not have permission to perform this action" 
                });
            }
            console.log(req.body);
            next();
    })};

    static verifiyUser = asyncFun( (req,res,nxt) => {
        if(!req.user.isVerified) res.status(403).send({"message":"Please Verify your Email First"});
        nxt();
    });

    static validateAuth = asyncFun( async (req,res,nxt) => {
        const token = req.headers['x-auth-token'];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userData = await User.getUserById(decoded.userId);
            req.user = userData;
            nxt(); 
        } catch (error) {
            return res.status(400).send({
                message: "Invalid Token"
            });
        }
    });
    
}

module.exports = authController;
