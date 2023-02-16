const ProductManager = require("../dao/mongoManager/BdProductManager");
const BdCartManager = require("../dao/mongoManager/BdCartManager");

const views = async (req, res) => {
    let products = await ProductManager.getProduct();
    res.render("home", { products });
}

const viewCart = async (req, res) => {
    const carts = await BdCartManager.getCartsId();
    // const result = carts.map((products) => ({
    //     title: products.title + " " + products.description,
        
    // }));
    // res.render('cart', {
    //     products: products,
    //     hasPrevPage: !result.hasPrevPage,
    //     hasNextPage: !result.hasNextPage,
    // });
    res.render("cart",{carts});       
}

module.exports = {
    views,
    viewCart,
}
