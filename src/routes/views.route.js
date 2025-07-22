import { Router } from 'express';
import ProductManager from '../manager/productManager.js';
import { __dirname } from "../utils.js"

const pm=new ProductManager(__dirname+'/database/products.json')
const viewRoutes = Router()


viewRoutes.get("/",async(req,res)=>{
    const listadeproductos=await pm.getProductsView()
    res.render("home",{listadeproductos})
})

viewRoutes.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})





export default viewRoutes