'use strict'

const { findCartById } = require("../models/repositories/cart.repo");
const {NotFoundError, BadRequestError} = require('../core/error.response');
const { checkProductsByServer } = require("../models/repositories/product.repo");
const {getDiscountAmount} = require('./discount.service');
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require('../models/order.model')

class CheckoutService {
    //payload:
    /*
    {
        cart_id,
        user_id,
        shop_order_ids = [
            {
                shop_id,
                item_products:{
                    shop_id,
                    shop_discounts: []
                    product_list: [{
                        product_id,
                        product_quantity,
                    }]
                }
            }
        ],
    }
     */
    static async checkoutReview({
        cart_id, user_id, shop_order_ids = []
    }){
        //check cart_id
        const userCart = await findCartById(cart_id)
        if(!userCart)
            return BadRequestError("Cart not exist")

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = []
        //count total bill
        for(let i = 0; i < shop_order_ids.length; i++){
            let {shop_id} = shop_order_ids[i];
            let {shop_discounts, product_list} = shop_order_ids[i].item_products;
            // console.log(shop_order_ids[i]);
            const checkProductsServer = await checkProductsByServer(product_list)
            if(!checkProductsServer[0]) 
                throw new BadRequestError('order error')
            // total bill of user in a shop
            const checkoutPrice = checkProductsServer.reduce((acc, product) => {
                return acc + (product.product_price * product.product_quantity)
            }, 0)
            // total bill of the order
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shop_id: shop_id,
                shop_discount: shop_discounts,
                product_list: product_list,
                checkout_price: checkoutPrice,
                checkout_price_applied_discount: checkoutPrice
            }
            if(shop_discounts.length > 0){
                const {discount = 0} = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    user_id,
                    shop_id,
                    products: checkProductsServer
                })
                // update total discount
                checkout_order.totalDiscount += discount
                if(discount > 0) {
                    itemCheckout.checkout_price_applied_discount = checkoutPrice - discount
                }
            }
            checkout_order.totalCheckout = itemCheckout.checkout_price_applied_discount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        user_id, 
        cart_id,
        shop_order_ids,
        user_address = {},
        user_payment = {}
    }){
        const {shop_order_ids_new, checkout_order} = await this.checkoutReview({user_id, cart_id, shop_order_ids})
        // check if there is any product that over the inventory limit
        // get an array of products
        const products = shop_order_ids_new.flatMap(shop => shop.product_list)
        console.log('[1]', products)
        // apply optimistic locking
        const acquireProduct = []
        for(let i = 0 ; i < products.length; i++) {
            const {product_id, product_quantity} = products[i];
            const keyLock = await acquireLock(product_id, product_quantity, cart_id)
            acquireProduct.push(keyLock ? true : false) // check if any product in this cart is updated
            if(keyLock){
                await releaseLock(keyLock)
            }
        }
        // check if any product out of stock
        if(acquireProduct.includes(false)){
            throw new BadRequestError("Some products have updated, please go back to your cart and checkout")
        }

        const newOrder = new orderModel.create({
            order_user_id: user_id,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products:shop_order_ids_new,
            // order_trackingNumber,
            // order_status
        })

        // if insert successed, update product in user cart
        if(newOrder){

        }

        return newOrder
    }

    /*
        get an Order [user]
    */
    static async getOrderById({
        order_id
    }){
        
    }
    /*
        Query Order [user]
    */
    static async getOrdersByUser({
    }){

    }
    /*
        cancel an Orders info [user]
    */
    static async cancelOrderByUser({
        order_id
    }){

    }
    /*
        update an Order status [shop, admin] !important
    */
    static async UpdateOrderStatusByShop({
    }){

    }
}

module.exports = CheckoutService;