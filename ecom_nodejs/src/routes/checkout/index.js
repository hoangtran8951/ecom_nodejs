'use strict'

const express = require('express')
const {asyncHandler} = require('../../helpers/asyncHandler')
const CheckoutController = require('../../controllers/checkout.controller')
// const { authentication } = require('../../auth/authUtils')
const router = express.Router()


// authentication
// router.use(authentication)
///////////////////////
router.post('', asyncHandler(CheckoutController.checkoutReview))
router.post('/order', asyncHandler(CheckoutController.orderByUser))

module.exports = router