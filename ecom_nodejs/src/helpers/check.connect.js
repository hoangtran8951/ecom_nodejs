'use strict'

const os = require('os')
const process = require('process')
const mongoose = require('mongoose')
const _SECONDS = 5000
// count number of connections
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections:: ${numConnection}`)
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnections = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // hyperthetically 5 connections / 1 core
        const maxConnections = numCores*5;
        console.log(`memory Usage:: ${memoryUsage/1024/1024} MB`)
        if(numConnections > maxConnections){
            console.log("Connection overload detected!")
        }
    }, _SECONDS) // Monitor every 5 seconds
}


module.exports = {
    countConnect,
    checkOverload
}