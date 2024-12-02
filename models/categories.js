import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/productCategoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);

export default router;
