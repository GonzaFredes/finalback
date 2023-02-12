const express = require('express');
const handlebars = require('express-handlebars');
const productsRoute = require('./routes/products.routes');
const cartsRoute = require ('./routes/carts.routes')
const productsRouteBd = require('./routes/products.router.bd')
const cartsRouteBd = require('./routes/carts.router.bd')
const viewRoute = require('./routes/views.route')
const chatsRouter = require('./routes/chats.router')
const productModel = require('./dao/models/products.model')
const server = express();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const httpServer = server.listen(8080, ()=> {
    console.log('Servidor Listo en puerto 8080')
});

//handlerbars
server.engine('handlebars', handlebars.engine());
server.set('views', __dirname + '/views');
server.set('view engine', 'handlebars');
//express
server.use(express.static(__dirname+'/public'));
server.use(express.json())
server.use(express.urlencoded({extended:true}))
//rutas

server.use("/api/products/", productsRoute);
server.use("/api/carts/", cartsRoute);
server.use("/", viewRoute);

//rutas mongodb
server.use("/api/productsBd/", productsRouteBd );
server.use("/api/cartsBd/", cartsRouteBd );
server.use("/api/chats/", chatsRouter );


// mongoose.connect('mongodb+srv://gonzafredes1:SQ3HgTEmJgPANS7K@pruebabackend.7gddxpl.mongodb.net/?retryWrites=true&w=majority',

// (error)=>{
//    if (error) {
//      console.log('error de conexion', error);
//      process.exit();
//    }else {
//     console.log('Conexion exitosa');
//    }
// });

const test = async () => {
  await mongoose.connect ('mongodb+srv://gonzafredes1:SQ3HgTEmJgPANS7K@pruebabackend.7gddxpl.mongodb.net/?retryWrites=true&w=majority',
 );
console.log('Se ah conectado a la base de datos correctamente');
};

test();

