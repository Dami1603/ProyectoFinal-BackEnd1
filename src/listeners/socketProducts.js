import ProductManager from "../manager/productManager.js";
import CartManager from "../manager/cartManager.js";
import { __dirname } from "../utils.js";

const pm = new ProductManager();
const cm = new CartManager();

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id);

        // Función para enviar lista de productos
        const sendProducts = async () => {
            const products = await pm.getProductsView();
            socket.emit("enviodeproducts", products);
        };

        // Enviar lista inicial
        await sendProducts();

        // Agregar nuevo producto
        socket.on("addProduct", async (obj) => {
            await pm.addProduct(obj);
            await sendProducts();
        });

        // Eliminar Producto
        socket.on("deleteProduct",async(obj)=>{
            await pm.deleteProduct(obj)
            await sendProducts()
        })

        // Solicitud de lista de productos
        socket.on("requestProducts", async () => {
            await sendProducts();
        });

        // Agregar al carrito
        // No funciona si se crea anteriormente 1 carrito
        socket.on("addToCart", async (data) => {
            try {
                const { productId, cartId } = data;
                
                let cart;
                if (!cartId) {
                    // Crear nuevo carrito si no existe
                    cart = await cm.createCart();
                } else {
                    // Usar carrito existente
                    try {
                        cart = await cm.getCartById(cartId);
                        if (!cart) {
                            cart = await cm.createCart();
                        }
                    } catch (err) {
                        // Si el ID no es válido, crear uno nuevo
                        cart = await cm.createCart();
                    }
                }

                await cm.addProductToCart(cart._id, productId);
                socket.emit("cartUpdate", { 
                    status: "success",
                    cartId: cart._id,
                    message: "Producto agregado al carrito"
                });
            } catch (error) {
                socket.emit("cartUpdate", { 
                    status: "error",
                    message: error.message
                });
            }
        });
    });
};

export default socketProducts;