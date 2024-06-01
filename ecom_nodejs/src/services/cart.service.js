'use strict'

const { forEach } = require('lodash');
const { NotFoundError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const { product } = require('../models/product.model');
const {createUserCartByUserId, updateUserCartQuantity} = require('../models/repositories/cart.repo')
const {getProductInfoInDb} = require('../models/repositories/product.repo')
const _ = require('lodash')
//add product to cart[user]
//reduct product quantity by one [user]
//increase product quantity by one [user] 
//remove all items on the cart [user]
// remove cart item [user]

class CartService {
    static async addToCart({
        user_id, product = {}
    }){
        //check user card
        const userCart = await cartModel.findOne({cart_user_id: user_id});
        if(!userCart){
            //create new cart
            return await createUserCartByUserId({user_id: user_id, product: product})
        }
        // if existed by no product
        
        if(userCart.cart_products.length === 0 ){
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return await updateUserCartQuantity({user_id: user_id, product: {product_id: product.product_id, product_quantity: product.product_quantity}})
    }

    static async updateCart({
        user_id, shop_order_ids

    }){
        const {product_id, product_quantity, old_quantity} = shop_order_ids[0]?.item_products;
        // check product 
        const foundProduct = await getProductInfoInDb({product_id, unSelect: []})
        console.log(product_id, product_quantity, old_quantity)
        if(!foundProduct) 
            throw new NotFoundError("this product is not exist")
        
        //check if the product is in the right shop?
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id)
            throw new NotFoundError("this product is not in the right shop")

        if(product_quantity === 0){
            //delete product
            return this.deleteUserCart({user_id, product_id})
        }
        console.log(product_id, product_quantity, old_quantity)
        return await updateUserCartQuantity({user_id: user_id, product: {product_id, product_quantity: +product_quantity-old_quantity}})
    }

    static async deleteUserCart({
        user_id, product_id
    }){
        const filter = {cart_user_id: user_id, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {
                    product_id: product_id
                }
            }
         }
         const deleteCart = await cartModel.updateOne(filter, updateSet)
         return deleteCart
    }

    static async getListItemsInCart({user_id}){
        // let cartItems = _.toArray(await cartModel.findOne({cart_user_id: user_id}).select(['cart_products']).lean())
        let cartItems = await cartModel.findOne({cart_user_id: user_id}).select(['cart_products']).lean()
        // console.log(cartItems.cart_products)
        cartItems.cart_products = await Promise.all(cartItems.cart_products.map(async (ele) => {
            let foundProduct = await getProductInfoInDb({product_id: ele.product_id, unSelect: []})
            if(foundProduct){
                console.log(foundProduct)
                ele["product_name"] = foundProduct.product_name
                ele["product_thumb"] = foundProduct.product_thumb
                ele["product_price"] = foundProduct.product_price
            }
            console.log(ele)
            return ele
        }))
        console.log(cartItems.cart_products)
        return cartItems
    }
}

module.exports = CartService;