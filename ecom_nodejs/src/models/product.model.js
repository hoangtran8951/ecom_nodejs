'use strict'

const {model, Schema} = require('mongoose'); // Erase if already required
const slugify = require('slugify')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_thumb:{
        type:String,
        required:true,
    },
    product_description: String,
    product_slug: String,
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity:{
        type:Number,
        required:true,
    },
    product_type:{
        type:String,
        required:true,
        enum:['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes:{
        type: Schema.Types.Mixed,
        required:true,
    },
    // more
    product_ratingAverage: {
        type:Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val*10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublish: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
},{
    timestamps:true,
    collection: COLLECTION_NAME 
});
// create index for search
productSchema.index({product_name: "text", product_description: "text"})
// document middleware run before .save and .create
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})
// define the product type = clothing
const clothingSchema = new Schema({
    product_shop: {
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    brand: {type:String, require:true},
    size:String,
    material:String
},{
    timestamps:true,
    collection: 'clothes'
}) 
// define the product type = electronics
const electronicsSchema = new Schema({
    product_shop: {
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    manufacturer: {type:String, require:true},
    model:String,
    color:String
},{
    timestamps:true,
    collection:'electronics'
}) 

const furnitureSchema = new Schema({
    product_shop: {
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    brand: {type:String, require:true},
    size:String,
    material:String
},{
    timestamps:true,
    collection:'furiniture'
}) 

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema),
    furniture: model('Furniture', furnitureSchema),
};