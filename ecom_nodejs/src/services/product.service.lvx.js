'use strict'

// const {product, clothing, electronics, furniture} = require('../models/product.model')
const productModel = require('../models/product.model')
const {BabRequestError, BadRequestError} = require('../core/error.response')
const config = require('./product.config')

//define factory class to create product

class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef){
        console.log(typeof(type),typeof(eval(classRef)));
        ProductFactory.productRegistry[type] = eval(classRef)
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass){
            throw new BabRequestError("Invalid Product Type")
        }
        
        return new productClass(payload).createProduct();
    }
}

//define Base product class
class Product {
    constructor({
        product_name, product_thumb, product_price, product_description,
        product_type, product_shop, product_attributes, product_quantity 
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_price = product_price;
        this.product_description = product_description;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    } 

    //create new product
    async createProduct(product_id) {
        // return await product.create({...this, _id: product_id});
        return await productModel.product.create({...this, _id: product_id});
    }
}

//define subclass for different product types Clonthing
// class Clothing extends Product {
//     async createProduct() {
//         const newClothing = await clothing.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         })
//         if(!newClothing)
//                 throw new BabRequestError("create new clothing error")
//         const newProduct = await super.createProduct(newClothing._id)
//         if(!newClothing)
//             throw new BabRequestError("create new clothing error")
//         return newProduct
//     }
// }
// //define subclass for different product types Electronics
// class Electronics extends Product {
//     async createProduct() {
//         const newElectronic = await electronics.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         })
//         if(!newElectronic)
//                 throw new BabRequestError("create new electronics error")
//         console.log(newElectronic);
//         const newProduct = await super.createProduct(newElectronic._id)
//         if(!newElectronic)
//             throw new BabRequestError("create new electronics error")
//         return newProduct
//     }
// }
// //define subclass for different product types Furnitures
// class Furniture extends Product {
//     async createProduct() {
//         const newfurniture = await furniture.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         })
//         if(!newfurniture)
//                 throw new BabRequestError("create new furnitures error")
//         console.log(newfurniture);
//         const newProduct = await super.createProduct(newfurniture._id)
//         if(!newfurniture)
//             throw new BabRequestError("create new furnitures error")
//         return newProduct
//     }
// }

//register new product type
// ProductFactory.registerProductType('Electronics', Electronics)
// ProductFactory.registerProductType('Clothing', Clothing)
// ProductFactory.registerProductType('Furniture', Furniture)
for(const category in config){
    const data = config[category];
    const newClass = class extends Product {
        async createProduct() {
            console.log(typeof(data['model']))
            console.log(data['model']);
            const newSubProduct = await data['model']({
                ...this.product_attributes,
                product_shop: this.product_shop
            })
            if(!newSubProduct)
                    throw new BabRequestError("create new subProduct error")
            console.log(newSubProduct);
            const newProduct = await super.createProduct(newSubProduct._id)
            if(!newProduct)
                throw new BabRequestError("create new Product error")
            return newProduct
        }
    };
    global[category] = newClass;
    // eval(category + ' = newClass;');
    ProductFactory.registerProductType(data["collection"], category)    
    // console.log(`Category: ${category}, Module: ${data["collection"]}`);
}

module.exports = ProductFactory;