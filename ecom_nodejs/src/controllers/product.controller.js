'use strict'


const ProductService = require('../services/product.service')
// const ProductService = require('../services/product.service.lvx')
const {OK, CREATED} = require('../core/success.response')
class ProductController {

    createProduct = async (req, res, next) => {
        new CREATED ({
            message: "Create new Product successfully",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new OK ({
            message: "Updated Product successfully",
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getAllDraftForShop = async (req, res, next) => {
        new OK ({
            message: "Find all draft for shop successfully",
            metadata: await ProductService.findAllDraftsForShop({product_shop: req.user.userId, limit: req.body.pageSize, skip: +req.body.pageNumber-1})
        }).send(res)
    }
    getAllPublishedForShop = async (req, res, next) => {
        new OK ({
            message: "Find all published products for shop successfully",
            metadata: await ProductService.findAllPublishedForShop({product_shop: req.user.userId, limit: req.body.pageSize, skip: +req.body.pageNumber-1})
        }).send(res)
    }
    publicProductByShop = async ( req, res, next ) => {
        new OK ({
            message: "The Product is published successfully",
            metadata: await ProductService.publishProduct({product_shop: req.user.userId, product_id: req.params.id})
        }).send(res)
    }
    unpublicProductByShop = async ( req, res, next ) => {
        new OK ({
            message: "The Product is unpublished successfully",
            metadata: await ProductService.unpublishProduct({product_shop: req.user.userId, product_id: req.params.id})
        }).send(res)
    }
    searchProduct = async ( req, res, next ) => {
        new OK ({
            message: "Search product by keyword successfully",
            metadata: await ProductService.searchProducts(req.params.keyword)
        }).send(res)
    }
    GetAllProducts = async ( req, res, next ) => {
        new OK ({
            message: "Get all products successfully",
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    GetProduct = async ( req, res, next ) => {
        new OK ({
            message: "Get product successfully",
            metadata: await ProductService.findProduct({
                ...req.body,
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }
}

module.exports = new ProductController()