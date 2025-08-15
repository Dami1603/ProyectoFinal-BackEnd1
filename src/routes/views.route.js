import { Router } from 'express';
import ProductManager from '../manager/productManager.js';
import { __dirname } from "../utils.js"
import CartManager from '../manager/cartManager.js';

const pm=new ProductManager()
const cm=new CartManager()
const viewRoutes = Router()


viewRoutes.get("/",async(req,res)=>{
    res.render("home")
})



viewRoutes.get("/products",async(req,res)=>{
    const listadeproductos=await pm.getProductsView()
    res.render("products",{listadeproductos})
})


viewRoutes.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})





export default viewRoutes