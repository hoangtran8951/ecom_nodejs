'use strict'

const redis = require('redis')
const {promisify} = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (product_id, product_quantity, cart_id) => {
    const key = `lock_v2024_${product_id}`
    const retryTimes = 10
    const expireTime = 3000

    for(let i = 0; i < retryTimes; i++) {
        //create a key, those order have that key can access
        const result = await setnxAsync(key, expireTime)
        console.log("result: ", result)
        if(result === 1){
            // access the inventory
            const isReservation = await reservationInventory({product_id, product_quantity, cart_id})
            if(isReservation && isReservation.modifiedCount > 0){
                await pexpire(key, expireTime);
                return key
            }
            return null;
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async key => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(key)
}

module.exports = {
    acquireLock,
    releaseLock
}