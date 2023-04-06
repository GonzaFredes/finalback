const Products = require("../dao/mongoManager/BdProductManager");
const { ProductRepository } = require("../service/index.repository");

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

const addProductBd = async (req, res)=>{
  const product = req.body;
    // const newproduct = await Products.addProduct(product);
    const newproduct = await ProductRepository.add(product);
    if (newproduct){
      res.json(newproduct)    
    }else{
      res.json(newproduct)   
    }
}

const getProductIdBd = async (req, res)=>{
  const id = req.params.pid 
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
  // const UpdateProductId = await Products.UpdateProduct(id, product);
  const UpdateProductId = await ProductRepository.update(id, product);
  if (UpdateProductId){
     res.json(UpdateProductId)      
  }else{
    res.json(UpdateProductId)  
  }
}

const deleteProductBd = async (req, res)=>{
  const id = req.params.pid 
    // const deleteproduct = await Products.DeleteProductId(id);
    const deleteproduct = await ProductRepository.delete(id);
    if (deleteproduct){
      res.json(deleteproduct)      
    }else{
      res.json(deleteproduct)
    }
}

module.exports ={
    getProductsBd, 
    getProductIdBd,    
    addProductBd,
    UpdateProductBd,     
    deleteProductBd,
}
