'use strict'

const CartService = require('../services/cart.service')
// const ProductService = require('../services/product.service.lvx')
const {OK, CREATED} = require('../core/success.response')
class CartController {

    addToCart = async (req, res, next) => {
        new OK ({
            message: "Add product successfully",
            metadata: await CartService.addToCart({
                user_id: req.body.user_id,
                product: req.body.product
            })
        }).send(res)
    }
    
    updateCart = async (req,res, next) => {
        new OK ({
            message: "Update cart successfully",
            metadata: await CartService.updateCart({
                user_id: req.body.user_id,
                shop_order_ids: req.body.shop_order_ids
            })
        }).send(res)
    }
    deleteCartItem = async (req,res, next) => {
        new OK ({
            message: "Delete cart item successfully",
            metadata: await CartService.deleteUserCart({
                user_id: req.body.user_id,
                product_id: req.params.id
            })
        }).send(res)
    }
    
    getListItemsInCart = async (req,res, next) => {
        new OK ({
            message: "Get Item list in user cart successfully",
            metadata: await CartService.getListItemsInCart({
                user_id: req.body.user_id,
            })
        }).send(res)
    }
}

module.exports = new CartController()