import mongoose from "mongoose";

export const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la Base de datos");
  } catch (error) {
    console.error("Error conectando a la base:", error);
  }
};