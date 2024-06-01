const { inventory } = require("../inventory.model")
const {Types} = require('mongoose') 
const {convertObjectIdMongodb} = require('../../utils/index')
const insertInventory = async ({
    product_id, shop_id, stock, location = "unknown"
}) => {
    return await inventory.create({inven_productId: new Types.ObjectId(product_id), inven_shopId: new Types.ObjectId(shop_id), inven_stock: stock, inven_location: location})
}

const reservationInventory = async ({
    product_id, product_quantity, cart_id
}) => {
    const filter = {
        inven_product_id: convertObjectIdMongodb(product_id),
        inven_stock: {
            $gte: product_quantity
        }
    },
    update = {
        _inc: {
            inven_stock: -product_quantity
        },
        $push:{
            inven_reservations: {
                product_quantity,
                cart_id,
                createdOn: new Date()
            }
        }
    }
    return await inventory.findOneAndUpdate(filter, update)
}

module.exports = {
    insertInventory,
    reservationInventory
}