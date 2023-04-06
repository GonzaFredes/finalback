const BdProductManager = require("../dao/mongoManager/BdProductManager");
const ProductService = require("./product.service");

const ProductRepository = new ProductService(BdProductManager);

module.exports = {
    ProductRepository
}