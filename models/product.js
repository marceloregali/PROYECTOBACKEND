// models/product.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: Number, required: true },
  price: { type: Number, required: true }, // Asegúrate de que sea un número
  available: { type: Boolean, default: true }, // Cambiado de "status" a "available"
  stock: { type: Number, required: true }, // Asegúrate de que sea un número
  category: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
