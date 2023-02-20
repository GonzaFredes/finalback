const express = require('express');
const handlebars = require('express-handlebars');
const productsRouteBd = require('./routes/products.router.bd')
const cartsRouteBd = require('./routes/carts.router.bd')
const chatsRouter = require('./routes/chats.router')
const server = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoConnect = require ('connect-mongo');
const routerViews = require('./routes/views.route');
const routerSession = require('./routes/session.router');

mongoose.set('strictQuery', false)

server.listen(8080, ()=> {
    console.log('Servidor listo en puerto http://localhost:8080/')
});

//handlerbars
server.engine('handlebars', handlebars.engine());
server.set('views', __dirname + '/views');
server.set('view engine', 'handlebars');
//express
server.use(express.static(__dirname +'/public'));
server.use(express.json())
server.use(express.urlencoded({extended:true}))

//rutas
server.use(routerViews);
server.use("/api/session",routerSession);

//rutas mongodb
server.use("/api/productsBd/", productsRouteBd );
server.use("/api/cartsBd/", cartsRouteBd );
server.use("/api/chats/", chatsRouter );

// conexion con mongodb para productos
const test = async () => {
  await mongoose.connect ('mongodb+srv://gonzafredes1:SQ3HgTEmJgPANS7K@pruebabackend.7gddxpl.mongodb.net/?retryWrites=true&w=majority', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
 );
console.log('Se ah conectado a la base de datos correctamente');
};

test();

//session para cookies del login
server.use(session({
  store: MongoConnect.create({
    mongoUrl: 'mongodb+srv://gonzafredes1:SQ3HgTEmJgPANS7K@pruebabackend.7gddxpl.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
  }),
  secret: 'clavesecreta',
  resave: true,
  saveUninitialized: true,
}));


