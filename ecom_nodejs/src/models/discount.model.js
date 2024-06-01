'use strict' 

const {model, Schema, Types, Collection} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {
        type:String,
        required:true
    },
    discount_descriptions:{
        type:String,
        required:true
    },
    discount_type:{
        type:String,
        default: 'fixed_amount',
        enum: ['fixed_amount', 'percentage']
    },
    discount_value:{
        type:Number,
        required:true
    },
    discount_code:{
        type:String,
        required:true
    },
    discount_start_date: {
        type:Date,
        required:true
    },
    discount_end_date: {
        type:Date,
        required:true
    },
    discount_max_uses: {
        type:Number,
        require:true
    },
    discount_uses_count: {
        type:Number,
        require:true
    }, // num of used discount
    discount_users_used: {
        type:Array,
        default: []
    },
    discount_max_uses_per_user: {
        type:Number,
        require:true
    }, // max number of discounts a user can use
    discount_min_order_value: {
        type:Number,
        require: true
    },
    discount_max_value: {
        type:Number,
        require: false
    },
    discount_shop_id: {
        type: Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active:{
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        require: true,
        default: 'all',
        enum: ['all', 'specific']
    },
    discount_product_ids: {
        type:Array,
        default: []
    } // products that can apply the discount
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)
