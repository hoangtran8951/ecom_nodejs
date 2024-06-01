'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keyword', asyncHandler(productController.searchProduct))
router.get('', asyncHandler(productController.GetAllProducts))
router.get('/:id', asyncHandler(productController.GetProduct))

// authentication
router.use(authentication)
///////////////////////
router.post('', asyncHandler(productController.createProduct))
router.post('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.post('/published/all', asyncHandler(productController.getAllPublishedForShop))
router.patch('/:product_id', asyncHandler(productController.updateProduct))

router.get('/publish/:id', asyncHandler(productController.publicProductByShop))
router.get('/unpublish/:id', asyncHandler(productController.unpublicProductByShop))






module.exports = router