import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items.push({ productId, quantity });
      await cart.save();
      res.status(200).json({ message: "Product added to cart" });
    } else {
      const newCart = new Cart({
        user: req.user.id,
        items: [{ productId, quantity }],
      });
      await newCart.save();
      res.status(201).json({ message: "Cart created and product added" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.productId"
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
