
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

//! 1)Middlewares
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    // Morgan Middleware
    app.use(morgan('dev'))
}


// Express Middleware
app.use(express.json())
// to open for public folders.
app.use(express.static(`${__dirname}/public`))

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

 