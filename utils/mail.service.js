const nodemailer = require('nodemailer');

class mailService {

    constructor(){
          this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 465, 
            secure: true, 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.APP_PASS  
            }
          });
    }

    // Function to send verification email
    async sendVerificationEmail (toEmail, verificationLink)  {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: toEmail,
          subject: 'GradeRoom : Email Verification',
          html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`
        };
        try {
          await this.transporter.sendMail(mailOptions);
          console.log('Verification email sent to:', toEmail);
        } catch (error) {
          console.error('Error sending verification email:', error);
        }
    };

    // Function to send password reset email
    async sendPasswordResetEmail  (toEmail, resetToken)  {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'GradeRoom : Password Reset',
        html: `<p>Please reset your password by using this token: <a href="${resetToken}">Reset Password</a></p>`
      };
      try {
        await this.transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', toEmail);
      } catch (error) {
        console.error('Error sending password reset email:', error);
      }
    };


}


module.exports = mailService;
