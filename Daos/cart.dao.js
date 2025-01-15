import Cart from "../models/cart.js";

class CartDAO {
  async getAllCarts() {
    return await Cart.find().populate("products.product");
  }

  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async createCart(data) {
    return await Cart.create(data);
  }

  async updateCart(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCart(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

export default new CartDAO();
