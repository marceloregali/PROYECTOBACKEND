import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const product = new Product({ name, price, description, category });
    await product.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
