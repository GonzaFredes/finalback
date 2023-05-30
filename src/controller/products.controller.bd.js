const Products = require("../dao/mongoManager/BdProductManager");
const CustomError = require("../errors/customError");
const { ProductRepository } = require("../service/index.repository");
const { invalidParamsProduct, invalidId } = require("../utils/creatorMsg");
const {ERROR_FROM_SERVER} = require ("../errors/enumErrors");
const {INVALID_FILTER} = require('../errors/enumErrors');

const getProductsBd = async (req, res) => {
  const {limit, page,sort, ...query} = req.query;
      //  const products = await Products.getProduct(page,limit,sort,query);
       const products = await ProductRepository.get (page,limit,sort,query);
       const {docs} = products;
       const state =  products ? "success" : "error";
       if (products){
          res.json({...products, status:state, payload:docs})      
       }else{
        res.json(products)
       }
};

// const addProductBd = async (req, res, next)=>{
//     const product = req.body;
//     if (!product.title) {
//       return next(CustomError.createError({code:401,msg:invalidParamsProduct(product),typeError:ERROR_FROM_SERVER}))
//     }
//     const newproduct = await ProductRepository.add(product);
//     if (newproduct){
//       res.json(newproduct)    
//     }else{
//       res.json(newproduct)   
//     }
// }

const addProductBd = async (req, res, next) => {
  const product = req.body;
  if (req.user === 'premium') {
    product.owner = req.user.email;
    const newproduct = await ProductRepository.add(product);
    return res.json(newproduct);
  }
  if (!product.owner) {
    const newproduct = await ProductRepository.add(product);
    return res.json(newproduct);
  }
}

const getProductIdBd = async (req, res, next)=>{
  const id = req.params.pid 
  // if (!id){
  //   return next(CustomError.createError({code:401,msg:invalidId(id),typeError:INVALID_FILTER}))
  // }
  // const getProductId = await Products.getProductId(id);
  const getProductId = await ProductRepository.getId(id);
  if (getProductId){
    res.json(getProductId)      
  }else{
    res.json(getProductId)
  }
}

const UpdateProductBd = async (req, res)=>{
  const id = req.params.pid 
  const product = req.body
  const UpdateProductId = await Products.UpdateProduct(id, product);
  // const UpdateProductId = await ProductRepository.update(id, product);
  if (UpdateProductId){
     res.json(UpdateProductId)      
  }else{
    res.json(UpdateProductId)  
  }
}

const deleteProductBd = async (req, res)=>{
  const id = req.params.pid;
  const productExist = await Products.getProductId(id);
  if (!productExist) {
    return res.json({ msg: 'Producto Inexistente' });
  }
  if (req.user.role === 'admin') {
    const deleteproduct = await Products.DeleteProductId(id);
    return res.json({ msg: 'Producto Eliminado' });
  }
  if (req.user.role === 'premium') {
    if (req.user.email == productExist.owner) {
      const deleteproduct = await Products.DeleteProductId(id);
      return res.json({ msg: 'Producto Eliminado' });
    } else {
      return res.json({ msg: 'No tienes permisos para eliminar este producto' });
    }
  } else {
    return res.json({ msg: 'No tienes permisos para eliminar este producto' });
  } 
}

module.exports ={
    getProductsBd, 
    getProductIdBd,    
    addProductBd,
    UpdateProductBd,     
    deleteProductBd,
}
