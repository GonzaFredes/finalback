const ProductManager = require("../dao/mongoManager/BdProductManager");
const CartController = require("./carts.controller.bd");

const views = async (req, res) => {
    let products = await ProductManager.getProduct();
    res.render("home",{products});      
}

const viewCart = async (req, res) => {
    let carts = await CartController.bdgetCartId();
    res.render("cart",{carts});       
}

module.exports ={
    views,
    viewCart,
}
