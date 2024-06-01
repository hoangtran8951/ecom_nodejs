require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const {default: helmet} = require('helmet')

const app = express();


// init middlewards
app.use(morgan("dev"))
app.use(helmet())
app.use(compression());
// app.disable('etag');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//init db
require('./dbs/init.mongodb.lv1')
const {checkOverload} = require('./helpers/check.connect')
// checkOverload();

//init routes
// app.get('/', (req, res, next) => {
//     const strCompress = 'Hello world'
//     return res.status(200).json({
//         message: "Welcome",
//         metadata: strCompress.repeat(10000)
//     })
// })
app.use('', require('./routes'))

//handling error
app.use((req,res,next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error,req,res,next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || "Internal Server Error"
    })
})
module.exports = app