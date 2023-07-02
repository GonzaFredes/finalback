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
            // const cart = await cartsModel.findById(id);
            const cart = await cartsModel.findById(id).populate('products.products');
            return cart
        } catch (error) {
            return {msg: "No se pueden traer los carritos"};
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
    
        // const productIndex = cart.products.findIndex((prod) => prod.product.toString() === product.id);
        const productIndex = cart.products.findIndex((prod) => product.toString() === product.id);
    
        console.log('productIndex', productIndex);
        if (productIndex === -1) {
          const newCart = {
            priceTotal: cart.priceTotal + product.price,
            quantityTotal: cart.quantityTotal + 1,
            products: [...cart.products, ...[{ products: product.id}]],
            id: cart.id,
          };
          console.log({ cid, product, newCart });
          const result = await this.updateToCart(newCart);
          console.log({ result });
        } else {
          const newCart = {
            priceTotal: cart.priceTotal + product.price,
            quantityTotal: cart.quantityTotal + 1,
            products: cart.products.map((cartProduct) =>
              cartProduct.products.toString() === products.id
                ? {
                    ...cartProduct,
                    quantity: ++cartProduct.quantity,
                  }
                : cartProduct
            ),
            id: cart.id,
          };
          console.log({ cid, products, newCart });
          const result = await this.updateToCart(newCart);
          console.log({ result });
        }
    }; 

    updateToCart = async (cart) => {
        const cartUpdated = await cartsModel.findByIdAndUpdate(cart.id, cart, { new: true, });
        return cartUpdated;
    };

        // /Nuevos metodos por aplicacion del ticket y el stock/
    deleteProductToCart = async (cid, pid) => {
        try {
        const cartFinded = await this.getById(cid);
        if (cartFinded.error)
            return {
            status: 404,
            error: `Cart con id ${cid} no encontrado`,
            };

        const productInCart = cartFinded.find((product) => product.pid._id == pid);

        if (productInCart) {
            await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { pid } } });
            return { status: 'success', message: 'Producto eliminado satisfactoriamente' };
        }
        return {
            status: 404,
            error: `El producto con el id ${pid} no fue encontrado en el carrito con id ${cid}`,
        };
        } catch (error) {
        return {
            status: 500,
            error: `Hubo un error al eliminar el producto con el  id ${pid}`,
        };
        }
    };

    deleteProducts = async (cid) => {
        try {
        const cartFinded = await this.getById(cid);
        if (cartFinded.error)
            return {
            status: 404,
            error: `Cart con id ${cid} no encontrado`,
            };

        await cartsModel.findByIdAndUpdate(cid, { products: [] });
        return { status: 'success', message: 'todos los productos eliminados' };
        } catch (error) {
        return {
            status: 500,
            error: `Hubo un error al eliminar todos los productos`,
        };
        }
    };

    deleteById = async (cid) => {
        try {
        const cartDeleted = await cartsModel.findByIdAndDelete(cid);
        return cartDeleted === null
            ? {
                status: 404,
                error: `Cart con id ${cid} no encontrado`,
            }
            : {
                status: 'success',
                message: `Cart con id ${cid} eliminado satisfactoriamente`,
            };
        } catch (error) {
        return {
            status: 500,
            error: `Un error ocurrio al eliminar los productos`,
        };
        }
    };

    purchase = async (ticket) => {
        const ticketCreate = await TicketsModel.create(ticket);
        return ticketCreate;
    };

}

module.exports = new BdCartsManager();
