import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productos: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

// Agrego un producto al carrito
cartSchema.methods.addProduct = function (productId, quantity) {
  const existingProductIndex = this.productos.findIndex(
    (p) => p.product.toString() === productId
  );

  if (existingProductIndex >= 0) {
    // Si el producto ya existe, aumenta la cantidad
    this.productos[existingProductIndex].quantity += quantity;
  } else {
    // Si el producto no existe, lo agrega
    this.productos.push({ product: productId, quantity });
  }
  return this.save();
};

// Elimino un producto del carrito
cartSchema.methods.removeProduct = function (productId) {
  this.productos = this.productos.filter(
    (p) => p.product.toString() !== productId
  );
  return this.save();
};

// Vacio el carrito
cartSchema.methods.emptyCart = function () {
  this.productos = [];
  return this.save();
};

// Creo y exporto el modelo de carrito
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
