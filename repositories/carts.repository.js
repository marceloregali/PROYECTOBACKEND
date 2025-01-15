import CartDAO from "../Daos/cart.dao.js";
import CartDTO from "../dtos/cart.dto.js";

class CartRepository {
  // Obtengo un carrito por ID
  async getCartById(id) {
    const cart = await CartDAO.findById(id);
    if (!cart) throw new Error("Carrito no encontrado");
    return new CartDTO(cart);
  }

  // Obtengo todos los carritos
  async getAllCarts() {
    const carts = await CartDAO.findAll();
    return carts.map((cart) => new CartDTO(cart));
  }

  // Creo un nuevo carrito
  async createCart(data) {
    const cart = await CartDAO.create(data);
    return new CartDTO(cart);
  }

  // Actualizo carrito
  async updateCart(id, data) {
    const updatedCart = await CartDAO.update(id, data);
    if (!updatedCart) throw new Error("Carrito no encontrado para actualizar");
    return new CartDTO(updatedCart);
  }

  // Elimino un carrito
  async deleteCart(id) {
    const deletedCart = await CartDAO.delete(id);
    if (!deletedCart) throw new Error("Carrito no encontrado para eliminar");
    return deletedCart; // Se devuelve el carrito eliminado
  }

  // Agrego un producto al carrito
  async addProductToCart(cartId, productId, quantity) {
    const cart = await CartDAO.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const updatedCart = await CartDAO.addProduct(cartId, productId, quantity);
    return new CartDTO(updatedCart);
  }

  // Elimino un producto del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await CartDAO.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const updatedCart = await CartDAO.removeProduct(cartId, productId);
    return new CartDTO(updatedCart);
  }

  // Vacio carrito
  async clearCart(cartId) {
    const cart = await CartDAO.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const updatedCart = await CartDAO.clear(cartId);
    return new CartDTO(updatedCart);
  }
}

export default new CartRepository();
