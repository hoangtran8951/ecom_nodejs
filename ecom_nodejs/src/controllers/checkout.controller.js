'use strict'

const CheckoutService = require('../services/checkout.service')
// const ProductService = require('../services/product.service.lvx')
const {OK, CREATED} = require('../core/success.response')
class CheckoutController {

    checkoutReview = async (req, res, next) => {
        new OK ({
            message: "Checkout cart successfully",
            metadata: await CheckoutService.checkoutReview({
                user_id: req.body.user_id,
                cart_id: req.body.cart_id,  
                shop_order_ids: req.body.shop_order_ids
            })
        }).send(res)
    }
    orderByUser = async (req, res, next) => {
        new CREATED ({
            message: "Create new order successfully",
            metadata: await CheckoutService.orderByUser({
                user_id: req.body.user_id,
                cart_id: req.body.cart_id,  
                shop_order_ids: req.body.shop_order_ids,
                user_address: req.body.user_address,
                user_payment: req.body.user_payment
            })
        }).send(res)
    }
    
}

module.exports = new CheckoutController()