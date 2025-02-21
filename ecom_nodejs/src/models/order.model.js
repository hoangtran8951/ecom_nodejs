'use strict'

const {model, Schema, Types, Collection} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_user_id:{
        type:Number, // temporarily
        required:true,
    },
    order_checkout:{
        type:Object,
        default:{}
    },
    order_shipping:{
        type:Object,
        default:{}
    },
    /*
    street, city, state, country
    */
    order_payment:{
        type:Object,
        default:{}
    },
    order_products: {
        type:Array,
        default:[]
    },
    order_trackingNumber:{
        type:String,
        default:"#0000125062024"
    },
    order_status:{
        type:String,
        enum:['pending','confirmed','shipped','cancelled','delivered'],
        default:'pending'
    },
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);