'use strict'
const {getUnSelectData} = require('../../utils/index')
const discountModel = require('../discount.model')

const findAllDiscountCodesUnSelect = async ({limit = 50 , page = 1, sort = "ctime" , unSelect, filter, model}) => {
    const skip = (page-1)*limit;
    const sortBy =  sort === 'ctime'? {_id: -1} : {_id: 1}
    return await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
}
const findAllDiscountCodesSelect = async ({limit = 50 , page = 1, sort = "ctime" , select: [], filter, model}) => {
    const skip = (page-1)*limit;
    const sortBy =  sort === 'ctime'? {_id: -1} : {_id: 1}
    return await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}

const checkDiscountExists = async ({model, filter}) => {
    const foundDiscount = await model.findOne(filter).lean();
    return foundDiscount;
}
module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists,
}