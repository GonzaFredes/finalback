const BdCartManager = require("../dao/mongoManager/BdCartManager");
const ProductManager = require("../dao/mongoManager/BdProductManager");


const views = async (req, res) => {
    const page = req.query.page
    const products = await ProductManager.getProduct(page);
    const view = products.docs.map((products) => ({ title: products.title, description: products.description, price: products.price, stock: products.stock, thumbnail: products.thumbnail}));
    res.render('home', { products: view, hasPrevPage: products.hasPrevPage, hasNextPage: products.hasNextPage, page: products.page, totalPages: products.totalPages, prevPage: products.prevPage, nextPage: products.nextPage});
}

const viewCart = async (req, res) => {
    const {cid} = req.params
    const carts = await BdCartManager.renderCartId(cid);
    // const view = carts.map((carts)=>({products: carts.products}));
    const view = carts.map((carts) => ({ priceTotal: carts.priceTotal, quantityTotal: carts.quantityTotal}));
    res.render('cart', {carts: view})
}

const login = async (req, res) => {
    // if(req.session.user) {
    //     res.render('profile',{name:req.session.user.first_name});
    // } else {
    //     res.render('login');
    // }
    res.render('login')
}

const register = async (req, res) => {
    // if(req.session.user) {
    //     res.render('profile',{name:req.session.user.first_name});
    // } else {
    //     res.render('register');
    // }
    res.render('register')
}

const profile = async (req, res) => {
    // if(req.session.user) {
    //     res.render('profile',{name:req.session.user.first_name});
    // } else {
    //     res.render('login');
    // }
    res.render('profile')
}

module.exports = {
    views,
    viewCart,
    login,
    register,
    profile,
}
