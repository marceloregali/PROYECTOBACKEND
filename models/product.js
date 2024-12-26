import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Esquema para productos
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
});

// Plugin de paginación para facilitar consultas
productSchema.plugin(mongoosePaginate);

// Crear el modelo de producto
const Product = mongoose.model("Product", productSchema);

export default Product;
