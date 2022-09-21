const fs = require('fs');
const Tour = require('./../models/tourModel');

//! Json data örnek olarak kullandigimizda bu sekilde oluyor.
/* const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
); */

// this middleware comes from tour Routes Line:6, for if part, we used only one in handlers.#
//! Burayi comment aldim cünkü mongodb kendi id konusudna uyarida bulunuyor.
/* exports.checkId = (req, res, next, value) => {
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

exports.checkBody = (req, res, next) => {
    if (!req.body.price || !req.body.name) {
        return res
            .status(400)
            .json({
                status: 'Failed',
                message : 'Invalid Request - Missing name and price'
        })
    }
    next();
}
*/

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
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
    } catch (err) {
        res
        .status(404)
        .json({
            status: 'Failed',
            message: err
        })
    }

}

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        // const tour = await Tour.findOne({_id: req.params.id})
        res
        .status(200)
        .json({
            status: 'Success',
            data : {
                tour
            }
        }) 

    } catch (err) {
        res
        .status(404)
        .json({
            status: 'Failed',
            message: err
        })
    }


}

exports.createTour = async (req, res) => {


    try {

        /*     const newTour = newTour({})
            newTour.save() */
        
            const newTour = await Tour.create(req.body)
        
            res
            .status(201)
            .json({
                message: 'Post is Success...',
                data: {
                    tour: newTour
                }
            });

    } catch(err) {
        res.status(400).json({
            status: 'Bad Request',
            message: "Invalid data sent!"
        })
    }
}

exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res
        .status(200)
        .json({
            status : 'Success - Updated',
            data : {
                tour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'Bad Request',
            message: "Invalid data sent!"
        })
    }

}

exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res
        .status(204)
        .json({
            status : 'Success - Deleted',
            data : null
        })
    } catch (err) {
        res.status(400).json({
            status: 'Bad Request',
            message: "Invalid data sent!"
        })
    }

}