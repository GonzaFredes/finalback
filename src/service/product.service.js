const BdProductManager = require("../dao/mongoManager/BdProductManager");

class ProductService {

    constructor(manager) {
        this.dao=manager;
    }

    get = (page,limit,sort,query) => this.dao.getProduct(page,limit,sort,query) // con el metodo yendo al index.repository.js
    add =  (product) => this.dao.addProduct(product) // con el metodo yendo al index.repository.js
    getId = (id) => this.dao.getProductId(id) // con el metodo yendo al index.repository.js
    UpdateProduct = (id,product) => BdProductManager.UpdateProduct(id,product) // con metodo yendo al BdProductManager directamente
    DeleteProductId = (id) => BdProductManager.DeleteProductId(id); // con metodo yendo al BdProductManager directamente

}

module.exports = ProductService;