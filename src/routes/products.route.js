import {Router} from "express"
import ProductManager from "../manager/productManager.js"
import { __dirname } from "../utils.js"


const manager=new ProductManager(__dirname+'/database/products.json')

const routerProducts =Router()

routerProducts.get("/products",async(req,res)=>{
    const products= await manager.getProducts(req.query)
    res.json({products})
})



routerProducts.get("/products/:pid", async (req, res) => {
    try {
        const productfind = await manager.getProductbyId(req.params);
        if (!productfind) {
            return res.status(404).json({ status: 404, message: "Producto no encontrado" });
        }
        res.status(200).json({ status: 200, product: productfind });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error interno del servidor" });
    }
});

routerProducts.post("/products", async (req, res) => {
    try {
        const newproduct = await manager.addProduct(req.body);
        if (!newproduct) {
            return res.status(400).json({ status: 400, message: "No se pudo crear el producto" });
        }
        res.status(201).json({ status: 201, product: newproduct });
    } catch (error) {
        res.status(503).json({ status: 501, message: "Servicio no disponible" });
    }
});

routerProducts.put("/products/:pid", async (req, res) => {
    try {
        const updatedproduct = await manager.updateProduct(req.params, req.body);
        if (!updatedproduct) {
            return res.status(404).json({ status: 404, message: "Producto no encontrado para actualizar" });
        }
        res.status(200).json({ status: 202, product: updatedproduct });
    } catch (error) {
        res.status(502).json({ status: 502, message: "Error de gateway" });
    }
});

routerProducts.delete("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const deleteproduct = await manager.deleteProduct(id);
        if (!deleteproduct) {
            return res.status(404).json({ status: 404, message: "Producto no encontrado para eliminar" });
        }
        res.status(200).json({ status: 203, message: "Producto eliminado", product: deleteproduct });
    } catch (error) {
        res.status(500).json({ status: 503, message: "Error interno del servidor" });
    }
});


export default routerProducts