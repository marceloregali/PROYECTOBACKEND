import ProductRepository from "../repositories/product.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";

export const purchase = async (req, res) => {
  const { cartId } = req.body;

  try {
    const cart = await CartRepository.findById(cartId);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const products = await ProductRepository.findAll({
      _id: { $in: cart.productIds },
    });
    const total = products.reduce((sum, product) => sum + product.price, 0);

    const ticketData = {
      userId: req.user.id,
      products: products.map((product) => ({
        productId: product.id,
        quantity: 1,
      })),
      total,
    };

    const ticket = await TicketRepository.create(ticketData);

    await CartRepository.clearCart(cartId);

    res.json({ message: "Compra realizada con éxito", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
