const BdProductManager = require("../dao/mongoManager/BdProductManager");
const BdUsersManager = require("../dao/mongoManager/BdUsersManager");
const ProductService = require("./product.service");
const UserService = require("./user.service");

const ProductRepository = new ProductService(BdProductManager);
const userService = new UserService(BdUsersManager);

module.exports = {
    ProductRepository,
    userService
}