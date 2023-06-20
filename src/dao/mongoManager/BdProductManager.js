const CustomError = require('../../errors/customError');
const productModel = require('../models/products.model');
const {INVALID_FILTER} = require ('../../errors/enumErrors');
const {invalidId} = require('../../utils/creatorMsg')

class BdProductManager {
  constructor() {
    this.products = []
  }

  getProduct = async (page = 1, limit = 6, sort, query) => {
    try {
      const products = await productModel.paginate(query, { page, limit, sort:{price:sort}});
      return products
    } catch (error) {
      return { msg: "Error al Obtener Productos" }
    }
  }

  addProduct = async (product) => {
    try {
      const newproduct = await productModel.create(product);
      return ({ msg: "Producto Creado", newproduct })
    } catch (error) {
      return { msg: "Error al Crear Producto" }
    }
  }

  getProductId = async (id, next) => {
    try {
      const getproductId = await productModel.findById(id);
      return getproductId
    } catch (error) {
      return next(CustomError.createError({code:401,msg:invalidId(id),typeError:INVALID_FILTER}))
    }
  }

  UpdateProduct = async (id, product) => {
    const { title, description, code, price, status, stock, category, thumbnail } = product
    try {
      const UpdateProduct = await productModel.findByIdAndUpdate(id, { title, description, code, price, status, stock, category, thumbnail });
      return UpdateProduct
    } catch (error) {
      return { msg: "Error al Actualizar Producto" }
    }
  }

  DeleteProductId = async (id) => {
    try {
      const deleteproduct = await productModel.findByIdAndDelete(id);
      return deleteproduct
    } catch (error) {
      return { msg: "Error al Eliminar Producto" }
    }
  }

}

module.exports = new BdProductManager();
