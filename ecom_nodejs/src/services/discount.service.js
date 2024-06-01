'use strict'
const {BadRequestError, NotFoundError}  = require('../core/error.response')
const discountModel = require('../models/discount.model')
const { convertObjectIdMongodb } = require('../utils')
const {findAllProductInDb} = require('../models/repositories/product.repo')
const {findAllDiscountCodesUnSelect,findAllDiscountCodesSelect, checkDiscountExists} = require('../models/repositories/discount.repo')
const { filter } = require('lodash')
// generate the discount code [shop || admin]
// get discount amount [user]
// get all discount codes [user || shop]
// verify discount code [user]
// delete discount code [admin || shop]
// cancel discount [user]

class DiscountService {
    static async createDiscountCode (payload) {
        const {
            code ,start_date, end_date, is_active,
            shop_id, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_users_per_user
        } = payload
        // check input fields
        console.log(new Date() , new Date(start_date))
        if( new Date() > new Date(start_date) || new Date() > new Date(end_date) ) 
            throw new BadRequestError("Discount code has expired!")
        
        if(new Date(start_date) >= new Date(end_date))
            throw new BadRequestError("Start date must be before end date")
        
        // create index for discount code
        const foundDiscount = await discountModel.findOne({discount_code: code, discount_shop_id: convertObjectIdMongodb(shop_id)}).lean();
        if(foundDiscount && foundDiscount.discount_is_active === true)
            throw new BadRequestError("Discount has existed!") 

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_descriptions: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count, 
            discount_users_used: [],
            discount_max_uses_per_user: max_users_per_user, 
            discount_min_order_value: min_order_value || 0, 
            discount_max_value: max_value,
            discount_shop_id: convertObjectIdMongodb(shop_id),
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids 
        })
        return newDiscount
    }

    static async updateDiscountCode() {
        
    }

    static async getAllProductsWithDiscountCode ({
        code, shop_id, limit, page
    }) {
        // create index for discount_codes
        const foundDiscount = await discountModel.findOne({discount_code: code, discount_shop_id: convertObjectIdMongodb(shop_id)}).lean();

        if(!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("Discount not exists!")

        const {discount_applies_to, discount_product_ids} = foundDiscount;
        let products
        switch (discount_applies_to) {
            case "all":
                products = await findAllProductInDb({
                    filter: {
                        product_shop: convertObjectIdMongodb(shop_id),
                        isPublish: true
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name']
                })
                break;
            case "specific":
                products = await findAllProductInDb({
                    filter: {
                        _id: {$in: discount_product_ids},
                        isPublish: true
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name']
                })
                break;
            default: 
                break;
        }
        return products;
    }
    static async getAllDiscountCodesByShopId({
        limit, page, shop_id
    }){
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertObjectIdMongodb(shop_id),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shop_id'],
            model: discountModel
        })
        return discounts
    }
    // apply discount code
    static async getDiscountAmount({code, user_id, shop_id, products}){
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shop_id: convertObjectIdMongodb(shop_id),
            },
            model: discountModel
        })
        // console.log("found discount: ", foundDiscount)
        if(!foundDiscount) 
            throw new NotFoundError("Discount not exists!")

        const {
            discount_is_active, 
            discount_max_uses,
            discount_end_date,
            discount_start_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
            discount_max_value,
            discount_applies_to,
            discount_product_ids
        } = foundDiscount
        if(!discount_is_active) 
            throw new NotFoundError('Discount expried!')
        if(!discount_max_uses) 
            throw new NotFoundError('Discount reached maximum number of uses')

        // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
        //     throw new NotFoundError('Discount expried!')

        // check if have min value
        let totalOrder = 0
        if(discount_min_order_value > 0 ){
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.product_price * product.product_quantity) 
            }, 0)
            if(totalOrder < discount_min_order_value)
                throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}`)
        }

        if(discount_max_uses_per_user > 0){
            const userUsesDiscount = discount_users_used.filter(user => user.user_id === user_id);
            if(userUsesDiscount.length >= discount_max_uses_per_user){
                return { 
                    totalOrder,
                    discount: 0,
                    totalPrice: totalOrder,
                    message: "you react the maximum usage of the discount"
                }
            }
        }
        //filtering the products that can apply the discount if needed
        let productsBillCanUseDiscount = 0;
        if(discount_applies_to !== "all"){
            productsBillCanUseDiscount =  products.reduce((acc, product) => {
                return acc + (discount_product_ids.includes(product.product_id) ? (product.product_price * product.product_quantity) : 0);
            }, 0)
        }
        else
            productsBillCanUseDiscount = totalOrder 
        //check is this discount is fixed or percentage
        let amount = 0;
        if(productsBillCanUseDiscount > 0 || discount.applies_to === 'all'){
            amount = discount_type === 'fixed_amount' ? discount_value : (discount_value/100 * productsBillCanUseDiscount);
            if(discount_max_value > 0 && amount > discount_max_value){
                amount = discount_max_value
            }
        }
        
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder-amount
        }
    }
    //lv_0 delete directly from dbs
    static async deleteDiscountCode({
        shop_id, code
    }){
        // const foundDiscount = await checkDiscountExists({
        //     filter: {
        //         discount_code: code,
        //         discount_shop_id: convertObjectIdMongodb(shop_id),
        //     },
        //     model: discountModel
        // })

        // if(!foundDiscount) 
        //     throw new NotFoundError("Discount not exists!")
        const deleted = await discountModel.findOneAndDelete({discount_code: code, discount_shop_id: convertObjectIdMongodb(shop_id)})
        return deleted
    }

    static async cancelDiscountCode({
        code, shop_id, user_id
    }){
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shop_id: convertObjectIdMongodb(shop_id),
            },
            model: discountModel
        })

        if(!foundDiscount) 
            throw new NotFoundError("Discount not exists!")
        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: user_id
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }


}

module.exports = DiscountService;