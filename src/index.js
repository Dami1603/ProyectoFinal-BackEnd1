import express from "express";
import { engine } from "express-handlebars";
import {__dirname} from "./utils.js"


import viewRoutes from './routes/views.route.js'
import routerProducts from "./routes/products.route.js";
import cartRouter from './routes/carts.route.js';
import socketProducts from "./listeners/socketProducts.js"

//import socket
import { Server } from "socket.io";

//import Mongoose & .env usando dotenv
import { config } from "dotenv";
import { connectDB } from "./database/db.js";

config()
connectDB()

//settings
const app = express();
app.set("PORT", 8080);
const server=app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});



app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views",__dirname+'/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//routes
app.use("/", viewRoutes),
app.use("/api/products", routerProducts)
app.use('/api/carts', cartRouter);


const socketServer = new Server(server)

socketProducts(socketServer)