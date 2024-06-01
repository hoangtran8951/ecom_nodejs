'use strict'

const { findById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log(key);
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error 1'
            })
        }
        //check objKey
        const objkey = await findById(key)
        
        if(!objkey){
            return res.status(403).json({
                message: 'Forbidden Error 2'
            })
        }
        req.objkey = objkey
        return next();
            
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req,res,next) => {
        if(!req.objkey.permissions){
            return res.status(403).json({
                    message: 'Permission denied'
                })
        }
        const validPermission = req.objkey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                    message: 'Permission denied'
                })
        }
        return next();
    }
}


module.exports = {
    apiKey,
    permission
};