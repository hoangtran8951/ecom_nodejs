'use strict'

const keytokenModel = require("../models/keytoken.model");
const mongoose = require('mongoose')

class keyTokenService {

    static createKeyTokens = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // console.log(`tokens::${tokens.publicKey}`)
            // return tokens ? tokens.publicKey : null;
            // level 1
            const filter = { user: userId},
            update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken},
            options = { new: true, upsert: true } // new is for return the new updated query, upsert is for creating a new object when not found
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    } 

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new mongoose.Types.ObjectId(userId)}).lean()
    }
    static removeKeyById = async (Id) => {
        return await keytokenModel.deleteOne({_id: new mongoose.Types.ObjectId(Id)})
        // return await keytokenModel.remove(Id)
    }
    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }
    static findByRefreshToken = async ( refreshToken ) => {
        return await keytokenModel.findOne({refreshToken})
    }
    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user: new mongoose.Types.ObjectId(userId)})
    }
    static updateRefreshToken = async (id, refreshToken, usedRefreshToken) => {
        return await keytokenModel.updateOne({_id: id}, {$set: {refreshToken: refreshToken}, $addToSet: {refreshTokensUsed: usedRefreshToken}})
    }
}

module.exports = keyTokenService;