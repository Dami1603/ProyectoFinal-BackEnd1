import Product from "../models/product.model.js";

export default class ProductManager {


  // READS
  getProducts = async (queryParams) => {
    try {
      const { 
        limit = 10, 
        page = 1, 
        category, 
        status, 
        sort 
      } = queryParams;
      
      // Construir el objeto de consulta
      const query = {};
      
      if (category) query.category = category;
      if (status !== undefined) query.status = status === 'true';
      
      // Opciones de paginación
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true
      };
      
      // Ordenamiento
      if (sort === 'asc') {
        options.sort = { price: 1 };
      } else if (sort === 'desc') {
        options.sort = { price: -1 };
      }
      
      // Ejecutar la consulta paginada
      const result = await Product.paginate(query, options);
      
      // Construir los links para paginación
      const baseUrl = '/api/products?';
      const queryString = new URLSearchParams({
        ...queryParams,
        page: result.page - 1,
        limit: result.limit
      }).toString();
      const prevLink = result.hasPrevPage ? `${baseUrl}${queryString.replace(`page=${result.page}`, `page=${result.page - 1}`)}` : null;
      
      const nextQueryString = new URLSearchParams({
        ...queryParams,
        page: result.page + 1,
        limit: result.limit
      }).toString();
      const nextLink = result.hasNextPage ? `${baseUrl}${nextQueryString}` : null;
      
      // Formatear la respuesta según lo solicitado
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage || null,
        nextPage: result.nextPage || null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
      };
      
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  };
  
  getProductsView = async () => {
    try {
      return await Product.find().lean();
    } catch (error) {
      throw new Error(error);
    }
  };
  
  getProductbyId = async (id) => {
    try {
      const { pid } = id;
      const product = await Product.findById(pid).lean();
      
      if (!product) {
        throw new Error("Producto no existe");
      }
      return product;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //CREATE
  addProduct = async (obj) => {
    const { title, description, price, thumbnail, category, status = true, code, stock } = obj;
    
    if (!title || !description || !price || !category || !code || !stock) {
      throw new Error("INGRESE TODOS LOS DATOS DEL PRODUCTO");
    }
    
    try {
      const product = new Product({
        title,
        description,
        price,
        category,
        status,
        thumbnail,
        code,
        stock
      });
      
      await product.save();
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("EL CODIGO DEL PRODUCTO QUE DESEA AGREGAR ES REPETIDO");
      }
      throw new Error(error);
    }
  };
  
  //UPDATE
  updateProduct = async (id, obj) => {
    const { pid } = id;
    const { title, description, price, category, thumbnail, status, code, stock } = obj;
    
    if (title === undefined || description === undefined || price === undefined || 
        category === undefined || status === undefined || code === undefined || stock === undefined) {
      throw new Error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION");
    }
    
    try {
      // Verifica si el código ya existe en otro producto
      const existingProduct = await Product.findOne({ code, _id: { $ne: pid } });
      if (existingProduct) {
        throw new Error("EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO");
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        pid,
        {
          title,
          description,
          price,
          category,
          status,
          thumbnail,
          code,
          stock
        },
        { new: true }
      ).lean();
      
      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }
      
      return updatedProduct;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //DELETE
  deleteProduct = async (id) => {
    try {
      const product = await Product.findByIdAndDelete(id).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error(error);
    }
  };
}