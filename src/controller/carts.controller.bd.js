const BdCartManager = require("../dao/mongoManager/BdCartManager");
const BdProductManager = require("../dao/mongoManager/BdProductManager");


const createCarts = async (req, res) => {
  const cart = req.body
  const Createcart = await BdCartManager.CreateCarts(cart);
  if (!Createcart.error) {
    res.json(Createcart)
  } else {
    res.json(Createcart)
  }
}

const bdgetCartId = async (req, res) => {
  const id = req.params.cid
  const cart = await BdCartManager.getCartsId(id);
  if (!cart.error) {
    res.json(cart)
  } else {
    res.json(cart)
  }
}

const bdgetCarts = async (req, res) => {
  const cart = await BdCartManager.getCarts();
  if (!cart.error) {
    res.json(cart)
  } else {
    res.json(cart)
  }
}

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params
  const product = await BdProductManager.getProductId(pid)

  if (!product) {
    return res.status(400).json({
      msg: `El producto con el id ${pid} no existe`,
      ok: false,
    });
  }

  const cart = await BdCartManager.getCartsId(cid);

  if (!cart) {
    const newCart = {
      priceTotal: product.price,
      quantityTotal: 1,
      products: [{ id: product.id, title: product.title, description: product.description, price: product.price, quantity: 1 }], //VER ESTO
      username: cid
    }

    const cartToSave = await BdCartManager.addProductToCarts(newCart);

    return res.status(200).json({
      msg: 'Carrito creado con exito',
      cart: cartToSave
    })
  }

  const findProduct = cart.products.find((product) => product.id === pid);

  if (!findProduct) {
    cart.products.push({ id: product.id, title: product.title, description: product.description, price: product.price, quantity: 1 })
    cart.quantity = cart.quantity + 1
    cart.priceTotal = cart.priceTotal + product.price
  } else {
    findProduct.quantity++;
    cart.priceTotal = cart.products.reduce((acumulador, total) => acumulador + (product.price * total.quantity), 0);
  }
  cart.quantityTotal = cart.quantityTotal + 1;
  const cartToUpdate = await BdCartManager.updateToCart(cart)

  return res.status(201).json({
    msg: `Producto agregado al carrito: ${cid}`,
    cart: cartToUpdate,
  })
};

const deleteProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const Cart = await BdCartManager.getCartsId(cid);
  const findProductTocart = Cart.products.find((prod) => prod.id === pid)

  if (!findProductTocart) {
    return res.status(400).json({
      msg: `El producto con el id:${pid} no existe`,
    });
  } else {
    if (findProductTocart.quantity === 1) {
      Cart.products = Cart.products.filter((prod) => prod.id !== pid);
    } else {
      findProductTocart.quantity--;
      Cart.priceTotal = Cart.products.reduce((acumulador, total) => acumulador + (total.price * total.quantity), 0);
    }
    Cart.quantityTotal = Cart.quantityTotal - 1;
    const cartToUpdate = await BdCartManager.updateToCart(Cart);
    return res.status(201).json({ msg: 'Producto eliminado del carrito', cart: cartToUpdate, });
  }
};

const deleteAllProductsCart = async (req, res) => {
  const { cid, pid } = req.params;
  const Cart = await BdCartManager.getCartsId(cid);
  if (Cart.products.length > 0) {
    Cart.products = [];
    Cart.quantityTotal = 0
    Cart.priceTotal = 0
    const cartToUpdate = await BdCartManager.updateToCart(Cart)
    return res.status(201).json({
      msg: 'Se eliminaron todos los productos del carrito',
      Cart: cartToUpdate
    })
  } else {
    return { msg: 'Este carrito no tiene productos para eliminar' };
  }
}

const updateCart = async (req, res) => {
  const { cid } = req.params;
  const body = req.body;
  const Cart = await Carts.getCartsId(cid);

  if (!Cart) {
    return res.status(200).json({
      msg: 'Carrito no encontrado',
    });
  }
  Cart.products = [];
  Cart.cantidadTotal = 0;
  Cart.totalPrice = 0;

  const product = await BdProductManager.getProductId(body.id);

  if (!product) {
    return res.status(400).json({
      msg: `El producto con el id ${pid} no existe`,
      ok: false,
    });
  }
  Cart.products.push({ id: product.id, quantity: body.quantity })

  Cart.quantityTotal = body.quantity;
  Cart.priceTotal = product.price * body.quantity;

  const cartToUpdate = await BdCartManager.updateCartProducts(Cart);

  return res.status(201).json({
    msg: 'Producto agregado al carrito: ${cid}',
    cart: cartToUpdate,
  });
}

const updateQuantityOnCart = async (req, res) => {
  const { cid, pid, } = req.params;
  const { quantity: quantity } = req.body;
  const Cart = await BdCartManager.getCartsId(cid);
  const product = await BdProductManager.getProductId(pid);
  if (!Cart) {
    return res.status(400).json({
      msg: "Carrito no encontrado",
      ok: false,
    })
  }

  const findProductTocart = Cart.products.find((prod) => prod.id === pid);

  if (!findProductTocart) {
    return res.status(400).json({
      msg: "Producto no encontrado",
      ok: false,
    })
  }

  if (quantity == undefined) {
    return res.status(400).json({
      msg: "Agregue cantidad a actualizar",
      ok: false,
    })
  } else {
    if (quantity < 0) {
      return res.status(400).json({
        msg: "La cantidad debe ser mayor o igual a  0",
        ok: false,
      })

    } else {
      findProductTocart.quantity = quantity
      if (findProductTocart.quantity > quantity) {
        cart.priceTotal = cart.priceTotal - (product.price * findProductcart.quantity)
      } else {
        cart.priceTotal = cart.priceTotal + (product.price * findProductcart.quantity)
      }
    }
  }
  Cart.quantityTotal = Cart.products.reduce((acumulador, total) => acumulador + quantity, 0)
  Cart.priceTotal = Cart.products.reduce((acumulador, total) => acumulador + (total.price * total.quantity), 0)
  const cartToUpdate = await BdCartManager.updateToCart(Cart)
  return res.status(201).json({
    msg: "Cantidad actualizada",
    Cart: cartToUpdate
  })

}

module.exports = {
  createCarts,
  bdgetCarts,
  bdgetCartId,
  addProductToCart,
  deleteProductToCart,
  deleteAllProductsCart,
  updateCart,
  updateQuantityOnCart,
}
