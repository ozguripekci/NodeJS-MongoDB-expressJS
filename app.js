
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

//! 1)Middlewares
// Morgan Middleware
app.use(morgan('dev'))


// Express Middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware 💎');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})



//! 3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)

//! 4) Start Server - Port


module.exports =app;

 