const fs = require('fs');


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// this middleware comes from tour Routes Line:6, for if part, we used only one in handlers.
exports.checkId = (req, res, next, value) => {
    if (req.params.id * 1 > tours.length) {    
        return res
            .status(404)
            .json({
                status: 'Failed',
                message : 'Invalid ID'
        })
    }
    next();
}


exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    const tour = tours.find(el => el.id === id)

    res
    .status(200)
    .json({
        status: 'Success',
        data : {
            tour
        }
    })
}

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    res
    .status(200)
    .json({
        status : 'Success - Updated',
        data : {
            tour : '<Updated tour is here...>'
        }
    })
}

exports.deleteTour = (req, res) => {
    res
    .status(204)
    .json({
        status : 'Success - Deleted',
        data : null
    })
}