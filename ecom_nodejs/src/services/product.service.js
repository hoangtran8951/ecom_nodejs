'use strict'

const {product, clothing, electronics, furniture} = require('../models/product.model')
const {BabRequestError, BadRequestError} = require('../core/error.response')
const {
    findAllDraftsForShopInDb, 
    publishProductInDb, 
    findAllPublishedForShopInDb, 
    unpublishProductInDb,
    searchProductsInDb,
    findAllProductInDb,
    getProductInfoInDb,
    updateProductById} = require('../models/repositories/product.repo'); 
const { Query, Types } = require('mongoose');
const {removeUndefineObject, updateNestedObjectParser} = require('../utils/index');
const { insertInventory } = require('../models/repositories/inventory.repo');

//define factory class to create product

class ProductFactory {
    //type: Clothing
    //payload
    static async createProduct(type, payload) {
        switch(type) {
            case 'Clothing':
                return new Clothing(payload).createProduct();
            case 'Electronics':
                return new Electronics(payload).createProduct();
            case 'Furniture':
                return new Furniture(payload).createProduct();
            default:
                throw new BadRequestError("Invalid Product Types") 
        }
    }
    static async updateProduct(type, product_id, payload) {
        switch(type) {
            case 'Clothing':
                return new Clothing(payload).updateProduct(product_id);
            case 'Electronics':
                return new Electronics(payload).updateProduct(product_id);
            case 'Furniture':
                return new Furniture(payload).updateProduct(product_id);
            default:
                throw new BadRequestError("Invalid Product Types") 
        }
    }

    //QUERY//

    /**
     * @description Get all Drafts for shop 
     * @param {Number} limit 
     * @return {Query}
     */
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShopInDb({query, limit, skip});
    }
    /**
     * @description Get all published products for shop 
     * @param {Number} limit 
     * @return {Query}
     */
    static async findAllPublishedForShop({product_shop, limit = 50, skip = 0}){
        const query = {product_shop, isPublish: true}
        return await findAllPublishedForShopInDb({query, limit, skip});
    }

    /**
     * @description Publish a product by shop owner 
     * @param {ObjectID} producID 
     * @return {0 | 1}
     */
    static async publishProduct({product_shop, product_id}){
        console.log("1______",product_id)
        return await publishProductInDb({product_shop, product_id})
    }
    /**
     * @description Unpublish a product by shop owner 
     * @param {ObjectID} producID 
     * @return {0 | 1}
     */
    static async unpublishProduct({product_shop, product_id}){
        return await unpublishProductInDb({product_shop, product_id})
    }

    /**
     * @description Search products
     * @param {ObjectID} producID 
     * @return {Query}
     */
    static async searchProducts(keyword){
        return await searchProductsInDb(keyword);
    }
    /**
     * @description find all products
     * @param {ObjectID} producID 
     * @return {Query}
     */
    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublish: true}}){
        return await findAllProductInDb({limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb']});
    }
    /**
     * @description find all products
     * @param {ObjectID} producID 
     * @return {Query}
     */
    static async findProduct(product_id){
        return await getProductInfoInDb({product_id, unSelect: ['__v'] });
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
        const newProduct = await product.create({...this, _id: product_id});
        if(newProduct){
            // add product_stock to inventory
            await insertInventory({product_id: newProduct._id, shop_id: newProduct.product_shop, stock: newProduct.product_quantity})
        }
        return newProduct;
    }
    async updateProduct(product_id, bodyUpdate){
        return await updateProductById({product_id, bodyUpdate, model: product})
    }
}

//define subclass for different product types Clonthing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing)
                throw new BabRequestError("create new clothing error")
        const newProduct = await super.createProduct(newClothing._id)
        if(!newClothing)
            throw new BabRequestError("create new clothing error")
        return newProduct
    }

    async updateProduct(product_id){
        const product_body = removeUndefineObject(this);
        // remove attr has null or underfined valua
        // check where to update? if updating product attr, do it in both tables
        if(product_body.product_attributes){
            // update in the subclass
            await updateProductById({product_id, bodyUpdate: updateNestedObjectParser(product_body.product_attributes), model: clothing}) 
        }
        const updatedProduct = await super.updateProduct(product_id, updateNestedObjectParser(product_body))
        return updatedProduct;
    } 
}
//define subclass for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic)
                throw new BabRequestError("create new electronics error")
        console.log(newElectronic);
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newElectronic)
            throw new BabRequestError("create new electronics error")
        return newProduct
    }
}
//define subclass for different product types Furnitures
class Furniture extends Product {
    async createProduct() {
        const newfurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newfurniture)
                throw new BabRequestError("create new furnitures error")
        console.log(newfurniture);
        const newProduct = await super.createProduct(newfurniture._id)
        if(!newfurniture)
            throw new BabRequestError("create new furnitures error")
        return newProduct
    }
}

module.exports = ProductFactory;