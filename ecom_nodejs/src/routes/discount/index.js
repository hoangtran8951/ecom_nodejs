'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.get('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllProductsWithDiscount))


// authentication
router.use(authentication)
///////////////////////
router.post('', asyncHandler(discountController.createDiscount))
router.get('', asyncHandler(discountController.getAllDiscountCodes))


module.exports = router