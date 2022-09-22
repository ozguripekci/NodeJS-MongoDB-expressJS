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

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        //! Build query
        // 1.a. Filtering 
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 1.b. Filtering 
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))
        // gtr, gt, lte ,lt

        let query = Tour.find(JSON.parse(queryStr));
        console.log(req.query)
        
        
        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // 3) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page -1) * limit
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist.');
        }

        //! execute the query
        const tours = await query;
        

        //! send response
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