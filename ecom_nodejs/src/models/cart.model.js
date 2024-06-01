'use strict'

'use strict'

const {model, Schema, default: mongoose} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type:String,
        required:true,
        enum:['active', 'completed', 'failed', 'pending'],
        default:'active'
    },
    cart_products: {
        type:Array,
        required:true,
        default:[]
    },
    cart_count_products: {
        type:Number,
        default:0
    },
    cart_user_id: {
        type:Number, 
        required:true
    }
},{
    // timeseries:{
    //     updatedAt: "updatedOn",
    //     createdAt: "createdOn"
    // },
    timestamps:true,
    collection: COLLECTION_NAME 
});

module.exports = model(DOCUMENT_NAME, cartSchema)