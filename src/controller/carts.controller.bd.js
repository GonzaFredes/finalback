const { v4 } = require("uuid");
const BdCartManager = require("../dao/mongoManager/BdCartManager");
const BdProductManager = require("../dao/mongoManager/BdProductManager");
const { mdwLogger } = require("../config/winston");
const mailingService = require("../service/mailing.service");


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
  if (product.email == req.user.email) {
    return res.status(400).json({
      msg: `Usuario no autorizado para agregar este producto`,
    });
  }

  const cart = await BdCartManager.getCartsId(cid);

  if (!cart) {
    const newCart = {
      priceTotal: product.price,
      quantityTotal: 1,
      products: [{ id: product.id, title: product.title, description: product.description, price: product.price, quantity: 1 }],
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

  setTimeout(() => {
    mailingService.sendMail({
      to: req.user.email, subject: `Hola ${req.user.first_name} que esperas? quedan pocas unidades`,
      html: `<h1>No esperes mas, y ve ahora a comprar tu ${product.title}</h1><a href="http://localhost:8080/">Termina la compra aquí</a>`
    })
  }, 5000)

  return res.status(201).json({
    msg: `Producto agregado al carrito: ${cid}`,
    cart: cartToUpdate,
  })
};

const deleteProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  req.mdwlLogger = `${cid}`;
  const Cart = await BdCartManager.getCartsId(cid);
  JSON.stringify(Cart)
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
    }
    const product = await BdProductManager.getProductId(pid);
    Cart.quantityTotal = Cart.quantityTotal - 1;
    const total = Cart.products.reduce((acumulador, total) => acumulador + product.price * total.quantity, 0);
    Cart.priceTotal = total;
    const cartToUpdate = await BdCartManager.updateToCart(Cart);
    return res.status(200).json({ msg: 'Producto eliminado del carrito', cart: cartToUpdate });
    // Cart.quantityTotal = Cart.quantityTotal - 1;
    // const cartToUpdate = await BdCartManager.updateToCart(Cart);
    // return res.status(201).json({ msg: 'Producto eliminado del carrito', cart: cartToUpdate, });
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

  const cartToUpdate = await BdCartManager.updateToCart(Cart);

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
      });
    } else {
      findProductTocart.quantity = quantity
      if (findProductTocart.quantity > quantity) {
        cart.priceTotal = cart.priceTotal - product.price * findProductTocart.quantity
      } else {
        cart.priceTotal = cart.priceTotal + product.price * findProductTocart.quantity
      }
    }
  }
  Cart.priceTotal = Cart.products.reduce((acumulador, total) => acumulador + total.price * total.quantity, 0)
  Cart.quantityTotal = Cart.products.reduce((Acumulador, ProductoActual) => Acumulador + ProductoActual.quantity, 0)
  const cartToUpdate = await BdCartManager.updateToCart(Cart)
  return res.status(201).json({
    msg: "Cantidad actualizada",
    Cart: cartToUpdate
  })
}

const purchase = async (req, res) => {
  let total = 0;
  const id = req.params.cid
  const carts = await BdCartManager.getCartsId(id);

  const cartsTicket = []
  const cartsReject = []

  for (let i = 0; i < carts.products.length; i++) {
    const productBd = await BdProductManager.getProductId(carts.products[i].id);

    if (productBd.stock >= carts.products[i].quantity) {
      const newproduct = {
        title: productBd.title,
        description: productBd.description,
        code: productBd.code,
        price: productBd.price,
        status: productBd.status,
        stock: productBd.stock - carts.products[i].quantity,
        category: productBd.category,
        thumbnail: productBd.thumbnail,
      };
      await BdProductManager.UpdateProduct(productBd.id, newproduct);
      total += productBd.price * carts.products[i].quantity;
      cartsTicket.push(carts.products); //para mostrar los productos que se agregaron en el ticket
      console.log('ok');
    } else (productBd.stock <= carts.products[i].quantity); {
      cartsReject.push(productBd); //muestra los productos que no se pudieron agregar por falta de stock
      console.log('No se pudieron agregar los siguientes productos,revise cantidad', cartsReject);
    }
  }

  // for (let i = 0; i < carts.length; i++) {
  //   const p = carts[i];
  //   const productBd = await BdProductManager.getProductId(p.id)

  //   if(productBd.stock >= p.quantity){
  //     cartsTicket.push(productBd)
  //   }else{
  //     cartsReject.push(productBd)
  //   }
  // }
  // const total = cartsTicket.reduce((acc,p)=>p.price+acc,0)

  const cart = await BdCartManager.purchase({ code: v4(), amount: total, purchaser: id, products: cartsTicket }); //agrega los campos a mostrar en el ticket
  if (!cart.error) {
    res.json(cart)
  } else {
    res.json(cart)
  }
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
  purchase
}
