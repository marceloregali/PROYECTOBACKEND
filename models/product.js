import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//  Productos
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
});

// Plugin de paginación para facilitar consultas
productSchema.plugin(mongoosePaginate);

//  Modelo de producto
const Product = mongoose.model("Product", productSchema);

export default Product;
