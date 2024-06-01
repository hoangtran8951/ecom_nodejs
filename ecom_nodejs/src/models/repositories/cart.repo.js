'use strict'

const cartModel = require("../cart.model")
const {convertObjectIdMongodb} = require('../../utils/index')

const createUserCartByUserId = async ({user_id, product}) => {
    const filter = {cart_user_id: user_id, cart_state: 'active'},
    update={
        $addToSet:{
            cart_products: product
        }
    },
    options = {new: true, upsert: true}

    const select = ["product_id", "product_thumb", "product_quantity"]
    return await cartModel.findOneAndUpdate(filter, update, options)
}

const updateUserCartQuantity = async ({user_id, product}) => {
    const {product_id, product_quantity} = product
    let filter = {
        cart_user_id: user_id,
        cart_state: 'active',
        'cart_products.product_id': product_id
    };

    let cart = await cartModel.findOne(filter);

    if (cart) {
        // Product exists in the cart, update its quantity
        console.log(product)
        let update = {
            $inc: {
                'cart_products.$.product_quantity': product_quantity
            }
        };

        let options = { new: true };
        return await cartModel.findOneAndUpdate(filter, update, options);
    } else {
        // Product doesn't exist in the cart, add it to the cart
        let update = {
            $addToSet: {
                cart_products: product
            }
        };

        let options = { new: true, upsert: true };
        return await cartModel.findOneAndUpdate({ cart_user_id: user_id, cart_state: 'active' }, update, options);
    }
}
const findCartById = async(cart_id) => {
    return await cartModel.findOne({_id: convertObjectIdMongodb(cart_id)});
}
module.exports = {
    createUserCartByUserId,
    updateUserCartQuantity,
    findCartById
}