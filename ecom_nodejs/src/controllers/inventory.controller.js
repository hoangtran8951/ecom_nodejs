'use strict'

const InventoryService = require('../services/inventory.service')
// const ProductService = require('../services/product.service.lvx')
const {OK, CREATED} = require('../core/success.response')
class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new OK ({
            message: "add Stock to inventory successfully",
            metadata: await InventoryService.addStockToInventory({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new InventoryController()