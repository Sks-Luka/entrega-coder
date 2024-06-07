import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./path.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import morgan from "morgan";
import  handlebars from 'express-handlebars';
import viewsRouter from  './routes/views.router.js';
import { Server } from "socket.io";
import ProductManager from "./managerProducts/manager.js";
const productManager = new ProductManager(`${__dirname}/data/products.json`)
//Inicializamos servidor express
const app  = express();
const PORT = 8080; //Alojamos el puerto del servidor en una variable para luego poder llevarnos esa misma variable

//Alojamos el sv en una variable para luego poder usarlo con Socket io
const httpServer = app.listen(PORT,()=>{ 
    console.log(`Servidor listo. Escuchando en el puerto ${PORT}`) 
});

app.use (express.static(__dirname + "/public"));
app.use(express.json());//Permite que el servidor pueda trabajar con los datos json
app.use(express.urlencoded({ extended: true }));//permite realizar consultas en la URL req.query

app.use(morgan('dev'));// Nos permite  visualizar el  detalle de las request del cliente.

//permite simplificar lo que sigue luego del slash /
app.use('/api/carts', cartRouter); 
app.use('/api/products', productRouter);
app.use('/',viewsRouter);
//middlewar
app.use(errorHandler);





// Setiamos Handlebars
app.engine('handlebars', handlebars.engine()); // Pasamos la funcionalidad del motor de plantillas 
app.set('views ', __dirname + '/views');// Le pasamos la carpeta de donde  se van a tomar  las vistas
app.set('view engine', 'handlebars' );// Setiamos el motor de plantillas



//Servidor Socket.io
const socketServer = new Server(httpServer);

//Utilizamos este array para guardar lo que generemos
const products = [];

//inicializamos la conexion 
socketServer.on('connection', async (socket)=>{
    console.log(` 🟢 ¡New connection! : ${socket.id}`);//esto no va a retornar el id del cliente que se conecte

    socket.on('disconnect', async ()=>{
        console.log('Usuario desconectado');
    })
    socketServer.emit('getProducts', await productManager.getProducts());

    socket.on('addProduct', async (prod) => {
        socketServer.emit('newProducts', await productManager.addProducts(prod));
        socketServer.emit('getProducts', await productManager.getProducts());
    })
    socketServer.emit('getProducts', await productManager.getProducts());
    
})

// clonando el repositorio en una nueva maquina