import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { cartId, totalAmount } = req.body;
    const order = new Order({
      user: req.user.id,
      cartId,
      totalAmount,
      status: "pending",
    });
    await order.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};
