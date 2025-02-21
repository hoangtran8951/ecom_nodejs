'use strict'

const AccessService = require('../services/access.service')
const {OK, CREATED} = require('../core/success.response')
class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        new OK ({
            message: "Logout success",
            metadata: await AccessService.handlerRefreshToken({refreshToken: req.refreshToken, user: req.user, keyStore: req.keyStore})
        }).send(res);
    }
    logout = async (req, res, next) => {
        new OK ({
            message: "Logout success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req, res, next) => {
        new OK ({
            message: "Login Ok!",
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    signUp = async (req, res, next) => {
        new CREATED ({
            message: "Regiserted Ok!",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()