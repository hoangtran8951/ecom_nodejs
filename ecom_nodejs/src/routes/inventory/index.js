'use strict'

const express = require('express')
const {asyncHandler} = require('../../helpers/asyncHandler')
const InvetoryController = require('../../controllers/inventory.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


// authentication
router.use(authentication)
///////////////////////
router.post('', asyncHandler(InvetoryController.addStockToInventory))

module.exports = router