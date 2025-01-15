import CartRepository from "../repositories/cart.repository.js";

class CartService {
  async getAllCarts() {
    return await CartRepository.getAllCarts();
  }

  async getCartById(id) {
    return await CartRepository.getCartById(id);
  }

  async createCart(data) {
    return await CartRepository.createCart(data);
  }

  async updateCart(id, data) {
    return await CartRepository.updateCart(id, data);
  }

  async deleteCart(id) {
    return await CartRepository.deleteCart(id);
  }
}

export default new CartService();
