'use strict'

const { NotFoundError } = require("../core/error.response");
const {inventory} = require("../models/inventory.model");
const {getProductInfoInDb} = require('../models/repositories/product.repo')

class inventoryService{
    static async addStockToInventory({
        stock,
        product_id,
        shop_id,
        location = "HCM city"
    }){
        const product = await getProductInfoInDb({product_id, unSelect: []})
        if(!product){
            throw new NotFoundError("this product is not exist")
        }

        const filter = {
            inven_shop_id: shop_id,
            inven_product_id: product_id
        },
        update = {
            $inc:{
                inven_stock: stock
            },
            $set:{
                inven_location: location
            }
        },
        options = {
            new: true,
            upsert: true
        }
        return await inventory.findOneAndUpdate(filter, update, options);
    }
}

module.exports = inventoryService;