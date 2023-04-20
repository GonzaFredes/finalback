const cartsModel = require('../models/carts.model');
const TicketsModel = require('../models/ticket.model');

class BdCartsManager {
    constructor() {
        this.carts = []
    }

    CreateCarts = async (cart) => {
        try {
            const Createcart = await cartsModel.create(cart);
            return Createcart
        } catch (error) {
            return { msg: "Error al crear Carritos" }
        }
    };

    getCartsId = async (id) => {
        try {
            const cart = await cartsModel.findById(id);
            return cart
        } catch (error) {
            return undefined;
        }
    };

    renderCartId = async (id) => {
        try {
            const cart = await cartsModel.findById(id);
            return [cart]
        } catch (error) {
            return {msg: "El carrito ingresado no existe"};
        } 
    }

    getCarts = async () => {
        try {
            const cart = await cartsModel.find();
            return cart
        } catch (error) {
            return { msg: "Error Al Mostrar Carrito" }
        }
    };

    addProductToCarts = async (cid, product) => {
        const cart = await cartsModel.findById(cid);
        console.log(JSON.stringify(product))
        const resultado = cart.products.findIndex((prod) => prod.id == product.id)
        console.log(resultado)
        if (resultado === -1) {
        } else {

        }
    };

    updateToCart = async (cart) => {
        const cartUpdated = await cartsModel.findByIdAndUpdate(cart.id, cart, { new: true, });
        return cartUpdated;
    };

    purchase = async (ticket) => {
        const ticketCreate = await TicketsModel.create(ticket);
        return ticketCreate;
    };


    // getCartByUsername = async (username) => {
    //     try {
    //         const cart = await cartsModel.findOne({username:'1'})
    //         return cart
    //     } catch (error) {
    //         return { msg: 'Error al mostrar carrito'}
    //     }
    // };
}

module.exports = new BdCartsManager();
