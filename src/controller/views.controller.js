const ProductManager = require("../dao/mongoManager/BdProductManager");
const BdCartManager = require("../dao/mongoManager/BdCartManager");

const views = async (req, res) => {
    const products = await ProductManager.getProduct();
    const view = products.docs.map((products) => ({ title: products.title, description: products.description, price: products.price, stock: products.stock, thumbnail: products.thumbnail}));
    res.render('home', { products: view, hasPrevPage: !products.hasPrevPage, hasNextPage: !products.hasNextPage, page: !products.page });
}

const viewCart = async (req, res) => {
    const carts = await BdCartManager.getCartsId();
    // const view = carts.docs.map((cart) => ({ priceTotal: cart.priceTotal, quantityTotal: cart.quantityTotal, products: cart.products}));
    res.render('cart', {carts: carts})
}

module.exports = {
    views,
    viewCart,
}
