'use strict'

const  mongoose  = require('mongoose')
const {product, furniture, clothing, electronics} = require('../product.model')
const { getSelectData, getUnSelectData, convertObjectIdMongodb } = require('../../utils/index')

const findAllDraftsForShopInDb = async ({query, limit, skip}) =>{
    return queryProduct({query, limit, skip})
}

const publishProductInDb = async ({product_shop, product_id}) => {
    console.log(product_id, product_shop)
    const result = await product.findOneAndUpdate({_id: convertObjectIdMongodb(product_id), product_shop: convertObjectIdMongodb(product_shop)}, {isDraft: false, isPublish: true})
    if(result)
        return 1;
    return 0;
}
const unpublishProductInDb = async ({product_shop, product_id}) => {
    const result = await product.findOneAndUpdate({_id: convertObjectIdMongodb(product_id), product_shop: convertObjectIdMongodb(product_shop)}, {isDraft: true, isPublish: false})
    if(result)
        return 1;
    return 0;
}

const findAllPublishedForShopInDb = async ({query, limit, skip}) =>{
    return queryProduct({query, limit, skip})
}
const searchProductsInDb = async (keyword) => {
    const regexSearch = new RegExp(keyword)
    const results = await product.find({
        $text: {$search: regexSearch},
        isPublish: true
    },{score: {$meta: "textScore"}})
    .sort({score: {$meta: "textScore"}})
    .lean()
    return results;
}
const findAllProductInDb = async ({limit, sort, page, filter, select}) => {
    const skip = (page-1)*limit;
    const sortBy =  sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    return products
}
const getProductInfoInDb = async ({product_id, unSelect}) => {
    return await product.findById(new convertObjectIdMongodb(product_id)).select(getUnSelectData(unSelect))
}
// Update product
const updateProductById = async({product_id, bodyUpdate, model, isNew = true}) => {
    return await model.findByIdAndUpdate(new  convertObjectIdMongodb(product_id), bodyUpdate, {new: isNew})
}
const checkProductsByServer = async (product_list) => {
    // console.log(product_list);
    return await Promise.all(product_list.map(async pro => {
        const fountproduct = await product.findOne({_id: convertObjectIdMongodb(pro.product_id)}).lean()
        // console.log(fountproduct)
        if(fountproduct){
            return {
                product_id: pro.product_id,
                product_quantity: pro.product_quantity,
                product_price: fountproduct.product_price
            }
        }
    }))
}
// internal functions
const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query).
    populate('product_shop', 'name email _id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
module.exports = {
    findAllDraftsForShopInDb,
    publishProductInDb,
    findAllPublishedForShopInDb,
    unpublishProductInDb,
    searchProductsInDb,
    findAllProductInDb,
    getProductInfoInDb,
    updateProductById,
    checkProductsByServer,
}