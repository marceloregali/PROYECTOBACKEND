import express from "express";

const router = express.Router();

router.get("/home", async (req, res) => {
  try {
    res.render("home", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
