const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// 2) Route handlers
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res
    .status(200)
    .json({
        status: 'Success',
        requestedAt: req.requestTime,
        results: tours.length,
        data : {
            tours
        }
    })
}

const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    const tour = tours.find(el => el.id === id)
//  if (id>tours.length) {
    if ( !tour ) {    
        return res
            .status(404)
            .json({
                status: 'Failed',
                message : 'Invalid ID'
            })
    }

    res
    .status(200)
    .json({
        status: 'Success',
        data : {
            tour
        }
    })
}

const createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id +1;
    const newTour = Object.assign({id:newId}, req.body);

    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res
        .status(201)
        .json({
            message: 'Post is Success...',
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {    
        return res
            .status(404)
            .json({
                status: 'Failed',
                message : 'Invalid ID'
        })
    }
    res
    .status(200)
    .json({
        status : 'Success - Updated',
        data : {
            tour : '<Updated tour is here...>'
        }
    })
}

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {    
        return res
            .status(404)
            .json({
                status: 'Failed',
                message : 'Invalid ID'
        })
    }
    res
    .status(204)
    .json({
        status : 'Success - Deleted',
        data : null
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not yet defined'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not yet defined'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not yet defined'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not yet defined'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not yet defined'
    })
}
/* // get all tours
app.get('/api/v1/tours', getAllTours)
// get one tour with id
app.get('/api/v1/tours/:id', getTour)
// create tour
app.post('/api/v1/tours', createTour)
// update tour
app.patch('/api/v1/tours/:id', updateTour)
// delete tour
app.delete('/api/v1/tours/:id', deleteTour) */

// 3) Routes

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)


app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser)

app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)


// 4) Start Server - Port

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});



 