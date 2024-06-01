'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require('../services/keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { ConflictRequestError, BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP : "SHOP",
    WRITTER: "WRITTER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    // check token used
    static  handlerRefreshToken = async ({refreshToken, user, keyStore}) => {

        const {userId, email} = user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError("Something wrong happed!! Pls relogin")
        }
        console.log("keyStore: ", keyStore.refreshToken)
        console.log("current: ", refreshToken)
        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("shop not registeted 1")
        }

        // const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        
        // if(foundToken){
        //     // decode 
        //     const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
        //     console.log({userId, email})
        //     // xoa
        //     await keyTokenService.deleteKeyById(userId)
        //     throw new ForbiddenError("Something wrong happed!! Pls relogin")
        // }
        // // // NO
        // const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        // if(!holderToken) 
        //     throw new AuthFailureError("shop not registeted")
        // // verify token
        // console.log("privateKey: " ,  holderToken.privateKey)
        // const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        // check userId
        console.log("[2]-----", {userId, email})
        const foundShop = await findByEmail({email})
        if(!foundShop) 
            throw new AuthFailureError("shop not registeted 2")
        // create a new pair tokens
        const tokens = await createTokenPair({userId: foundShop._id, email}, keyStore.publicKey, keyStore.privateKey)
        // update token 
        console.log("keyStore: " , keyStore);
        // keyStore.refreshToken = tokens.refreshToken
        // keyStore.refreshTokensUsed.push(refreshToken)
        await keyTokenService.updateRefreshToken(keyStore._id, tokens.refreshToken, refreshToken)
        // await keyStore.save();
        return {
            user,
            tokens
        }
    }
    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log({delKey})
        return delKey
    }
    // check email is dbs
    // check password
    // create and access and refresh tokens
    //generate tokens
    //get data frturn login
    static login = async ({email, password, refreshToken = null}) =>  {
        const foundShop = await findByEmail({email});
        if(!foundShop){
            throw new BadRequestError(`Shop not registered`);
        }

        const match = await bcrypt.compare(password, foundShop.password);
        if(!match){
            throw new AuthFailureError("Authentication failed");
        }
        const privateKey = new crypto.randomBytes(64).toString("hex")
        const publicKey = new crypto.randomBytes(64).toString("hex")
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

        await keyTokenService.createKeyTokens({
            userId : foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })
        return {
            shop: getInfoData({fields: ["_id", "name", "email"], object: foundShop}),
            tokens
        }
    }

    static signUp = async ({name, email, password}) => {
        // try {
            // check email
            const holderShop = await shopModel.findOne({email}).lean();
            if(holderShop)
                throw new BadRequestError('Error: Shop already exists');
            // create new shop
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({name, email, password: passwordHash, roles: [RoleShop.SHOP]})
            console.log('[P]::shop::', newShop);
            if(newShop){
                // create privateKey , publicKey
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = new crypto.randomBytes(64).toString("hex")
                const publicKey = new crypto.randomBytes(64).toString("hex")
                console.log({privateKey, publicKey})
                const keyStore = await keyTokenService.createKeyTokens({userId : newShop._id, publicKey, privateKey})
                if(!keyStore)
                    throw new BadRequestError()
                // const publicKeyObject = crypto.createPublicKey(publicKeyString); 
                // console.log(`Public Key: ${publicKeyObject}`)
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success::', tokens);
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ["_id", "name", "email"], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
    }
}

module.exports = AccessService