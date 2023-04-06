
class ProductService {

    constructor(manager) {
        this.dao=manager;
    }

    get = (page,limit,sort,query) => this.dao.getProduct(page,limit,sort,query)
    add =  (product) => this.dao.addProduct(product)
    getId = (id) => this.dao.getProductId(id)
    update = (id,product) => this.dao.updateProduct(id,product)
    delete = (id) => this.dao.deleteProduct(id)

}

module.exports=ProductService;