'use strict'

const {model, Schema, Types, Collection} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inven_productId:{
        type:Types.ObjectId,
        ref: "Product"
    },
    inven_location: {
        type:String,
        default: 'unknown'
    },
    inven_stock: {type: Number, required: true},
    inven_shopId:{
        type:Types.ObjectId,
        ref: "Shop"
    },
    inven_reservations: {
        type: Array,
        default: []
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}