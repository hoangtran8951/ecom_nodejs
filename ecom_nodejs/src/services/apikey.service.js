'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')
const findById = async (key) => {
    // const testKey = await apikeyModel.create({key: crypto.randomBytes(64).toString('hex'), status: true, permissions: ['0000']}) 
    // console.log(testKey);
    const objKey = await apikeyModel.findOne({key, status: true}).lean()
    return objKey
}

module.exports = {
    findById,
}