'use strict'

const _ = require('lodash')
const mongoose = require('mongoose')

const convertObjectIdMongodb = id => new mongoose.Types.ObjectId(id)

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = [] ) => {
    return Object.fromEntries(select.map(el => [el,1]))
}
const getUnSelectData = (select = [] ) => {
    return Object.fromEntries(select.map(el => [el,0]))
}
const removeUndefineObject = obj => {
    Object.keys(obj).forEach(key => {
        if(obj[key] === null || obj[key] === undefined)
            delete obj[key]
    })
    return obj;
}

const updateNestedObjectParser = obj => {  
    const final = {}
    Object.keys(obj).forEach(key => {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])){
            const response = updateNestedObjectParser(obj[key])
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a]
            })
        }else{
            final[key] = obj[key] 
        }
    })
    console.log(final);
    return final;
}
module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefineObject,
    updateNestedObjectParser,
    convertObjectIdMongodb,
}