import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importa el plugin

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
});

productSchema.plugin(mongoosePaginate); // Aplica el plugin al esquema

const Product = mongoose.model("Product", productSchema);
export default Product;
