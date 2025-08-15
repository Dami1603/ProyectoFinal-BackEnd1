import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export default class CartManager {


  // CREATE
  createCart = async () => {
    try {
      const newCart = new Cart();
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // READ
  getCartById = async (cid) => {
    try {
      const cart = await Cart.findById(cid).populate('products.product').lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartView = async () => {
      try {
        return await Cart.find().lean();
      } catch (error) {
        throw new Error(error);
      }
    };

  // UPDATE - Agregar producto al carrito
  addProductToCart = async (cid, pid) => {
    try {
      // Verificar que el producto existe
      const product = await Product.findById(pid);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Buscar el carrito y actualizarlo
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Verificar si el producto ya existe en el carrito
      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === pid
      );

      if (existingProductIndex !== -1) {
        // Incrementar cantidad si el producto existe
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Agregar nuevo producto al carrito
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // DELETE - Eliminar producto del carrito
  removeProductFromCart = async (cid, pid) => {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Filtrar los productos para eliminar el especificado
      cart.products = cart.products.filter(
        item => item.product.toString() !== pid
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // UPDATE - Actualizar todo el carrito
  updateCartProducts = async (cid, products) => {
    try {
      // Validar que todos los productos existen
      for (const item of products) {
        const productExists = await Product.findById(item.product);
        if (!productExists) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
      }

      const updatedCart = await Cart.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      ).populate('products.product');

      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }

      return updatedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // UPDATE - Actualizar cantidad de un producto
  updateProductQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === pid
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // DELETE - Vaciar carrito
  clearCart = async (cid) => {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      );
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // DELETE - Eliminar carrito
  deleteCart = async (cid) => {
    try {
      const deletedCart = await Cart.findByIdAndDelete(cid);
      if (!deletedCart) {
        throw new Error("Carrito no encontrado");
      }
      return deletedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}