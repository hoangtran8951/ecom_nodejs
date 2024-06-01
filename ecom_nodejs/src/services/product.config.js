const {product, clothing, electronics, furniture} = require('../models/product.model')
module.exports = {
    Electronics: {collection: "Electronics", model: electronics.create},
    Clothing: {collection: "Clothing", model: clothing.create},
    Furniture: {collection:"Furniture", model: furniture.create},
}