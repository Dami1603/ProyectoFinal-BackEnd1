import { Router } from "express";
import CartManager from "../manager/cartManager.js";

const router = Router();
const manager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json({ 
      status: "success", 
      cart: newCart 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      res.status(404).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await manager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.status(200).json({ status: "success", cart: updatedCart });
  } catch (error) {
    if (error.message === "Carrito no encontrado" || error.message === "Producto no encontrado") {
      res.status(404).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await manager.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.status(200).json({ 
      status: "success", 
      message: "Producto eliminado del carrito",
      cart: updatedCart 
    });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      res.status(404).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      throw new Error("Se debe proporcionar un arreglo de productos");
    }

    const updatedCart = await manager.updateCartProducts(
      req.params.cid,
      products
    );
    res.status(200).json({ status: "success", cart: updatedCart });
  } catch (error) {
    if (error.message === "Carrito no encontrado" || error.message.includes("Producto con ID")) {
      res.status(404).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      throw new Error("Se debe proporcionar la cantidad");
    }

    const updatedCart = await manager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );
    res.status(200).json({ status: "success", cart: updatedCart });
  } catch (error) {
    if (error.message === "Carrito no encontrado" || error.message === "Producto no encontrado en el carrito") {
      res.status(404).json({ status: "error", message: error.message });
    } else if (error.message === "La cantidad debe ser un número") {
      res.status(400).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const clearedCart = await manager.clearCart(req.params.cid);
    res.status(200).json({ 
      status: "success", 
      message: "Todos los productos fueron eliminados del carrito",
      cart: clearedCart 
    });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      res.status(404).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

export default router;