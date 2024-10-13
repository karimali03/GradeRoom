require('dotenv').config()


const express = require('express');
const cors = require('cors');
const { default: helmet } = require('helmet');


// Import routes
const usersRoute = require('./routes/user.route');
const errorHandler = require('./middlewares/error.handler');

const app = express();
require('./config/database');
const port =  process.env.PORT ||  3000;


// Error handling
process.on('unhandledRejection', (err) => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

process.on('uncaughtException', (err)  => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

// 3rd party Middleware
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS


// Custom middleware
app.use('/api/v1/users', usersRoute)


// Use routes


// error handling middleware
app.use(errorHandler);

  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api/v1`);
});
