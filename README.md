# GradeRoom

**GradeRoom** is a web application designed to help teachers efficiently grade students' assignments. It streamlines the process of creating assignments, allowing students to submit their work, and facilitating grading by teachers.

## Features

- **Authentication & Email Verification:** Secure sign-up and login system using JSON Web Tokens (JWT), with email verification for both students and teachers.
- **Password Reset via Email:** Users can reset their passwords through a link sent to their registered email.
- **Assignment Creation:** Teachers can create new assignments with detailed descriptions.
- **Student Submissions:** Students submit their responses in PDF format for each assignment.
- **Grading System:** Teachers can review student submissions and assign grades directly within the platform.

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **File Storage:** Files (PDF submissions) are stored directly on the server.

