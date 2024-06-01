'use strict'

const DiscountService = require('../services/discount.service')
// const ProductService = require('../services/product.service.lvx')
const {OK, CREATED} = require('../core/success.response')
class DiscountController {

    createDiscount = async (req, res, next) => {
        new CREATED ({
            message: "Create new Discount successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shop_id: req.user.userId
            })
        }).send(res)
    }
    
    getAllDiscountCodes = async (req,res, next) => {
        new OK ({
            message: "Get all Discounts successfully",
            metadata: await DiscountService.getAllDiscountCodesByShopId({
                ...req.query,
                shop_id: req.user.userId,

            })
        }).send(res)
    }
    getDiscountAmount = async (req,res, next) => {
        new OK ({
            message: "Get Discount amount successfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
    
    getAllProductsWithDiscount = async (req,res, next) => {
        new OK ({
            message: "Get all products with this discount successfully",
            metadata: await DiscountService.getAllProductsWithDiscountCode({
                ...req.query
            })
        }).send(res)
    }

    
    
}

module.exports = new DiscountController()