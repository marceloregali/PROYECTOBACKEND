import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//  Productos
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Aseguro que el nombre del producto sea único
    trim: true, // Eliminar espacios en blanco innecesarios
  },
  price: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"], // Validación de precio no negativo
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "El stock no puede ser negativo"], // Validación de stock no negativo
  },
  description: {
    type: String,
    default: "Sin descripción", // Valor por defecto si no se proporciona una descripción
  },
  category: {
    type: String,
    enum: ["Electronics", "Clothing", "Food", "Furniture", "Books"], // Categorías ya definidas
    default: "General", // Valor por defecto si no se proporciona una categoría
  },
});

// Método para verificar si hay suficiente stock
productSchema.methods.checkStock = function (quantity) {
  return this.stock >= quantity;
};

// Plugin de paginación para facilitar consultas
productSchema.plugin(mongoosePaginate);

//  Modelo de producto
const Product = mongoose.model("Product", productSchema);

export default Product;
