'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.controller')
const {asyncHandler} = require('../../helpers/asyncHandler')
// const { authentication } = require('../../auth/authUtils')
const router = express.Router()


// authentication
// router.use(authentication)
///////////////////////
router.post('', asyncHandler(CartController.addToCart))
router.post('/update', asyncHandler(CartController.updateCart))
router.delete('/:id', asyncHandler(CartController.deleteCartItem))
router.get('/items', asyncHandler(CartController.getListItemsInCart))

module.exports = router