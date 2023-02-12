const Products = require("../dao/mongoManager/BdProductManager");
const BdCartManager = require("../dao/mongoManager/BdCartManager");
const { find } = require("../dao/models/products.model");
const Carts = new BdCartManager()


const createCarts = async (req, res) => {
  const cart = req.body
  const Createcart = await Carts.CreateCarts(cart);
  if (!Createcart.error) {
    res.json(Createcart)

  } else {
    res.json(Createcart)
  }
}

const bdgetCartId = async (req, res) => {
  const id = req.params.cid
  const cart = await Carts.getCartsId(id);
  if (!cart.error) {
    res.json(cart)
  } else {
    res.json(cart)
  }
}

const bdgetCart = async (req, res) => {
  const cart = await Carts.getCarts();
  if (!cart.error) {
    res.json(cart)
  } else {
    res.json(cart)
  }
}

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params
  const product = await Products.getProductId(pid)

  if (!product) {
    return res.status(400).json({
      msg: `El producto con el id ${pid} no existe`,
      ok: false,
    });
  }

  const cart = await Carts.getCartsId(cid);

  if (!cart) {
    const newCart = {
      priceTotal: product.price,
      quantityTotal: 1,
      products: [{id: product.id, title: product.title,description: product.description,price: product.price,quantity: 1}],
      username: cid
    }

    const cartToSave = await Carts.addProductToCarts(newCart);

    return res.status(200).json({
      msg: 'Carrito creado con exito',
      cart: cartToSave
    })
  }

  const findProduct = cart.products.find((product) => product.id === pid);

  if (!findProduct) {
    cart.products.push({id:product.id, title: product.title, description: product.description,price:product.price, quantity: 1})
    cart.quantity = cart.quantity + 1
    // cart.priceTotal = cart.products.reduce(())

    const cartToUpdate = await Carts.updateToCart(cart)

    return res.status(201).json({
      msg: `Producto agregado al carrito: ${cid}`,
      cart: cartToUpdate,
    })
  }
};

const deleteProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const Cart = await Carts.getCartsId(cid);
  const findProductTocart = Cart.products.find((prod) => prod.id === pid)

  if (!findProductTocart) {
    return res.status(400).json({
      msg: `El producto con el id:${pid} no existe`,
      ok: false,
    });
  } else {
    if (findProductTocart.quantity === 1) {
      const index = Cart.products.findIndex((prod) => prod.id === pid);
      Cart.products.splice(index, 1);
    } else {
      findProductTocart.quantity--;
    }
    Cart.quantityTotal = Cart.quantityTotal - 1;
    const total = Cart.products.reduce((acumulador, total) => acumulador + total.price * total.quantity, 0);
    Cart.priceTotal = total;
    const cartToUpdate = await Carts.updateToCart(Cart);
    return res.status(200).json({ msg: 'Producto eliminado del carrito', cart: cartToUpdate });
  }
};



// const addProductToCart = async (req, res) => {
//   const { cid, pid } = req.params;
//   const product = await Products.getProductId(pid);
//   if (product) {
//     const respuesta = await Carts.addProductToCarts(cid,product);
//     return(product)
//   }else{
//     res.json(product)
//   }
// }


module.exports = {
  createCarts,
  bdgetCart,
  bdgetCartId,
  addProductToCart,
  deleteProductToCart,
}
