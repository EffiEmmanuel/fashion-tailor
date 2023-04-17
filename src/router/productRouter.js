import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  searchProducts,
} from "../controller/Product.controller.js";
const productRouter = express.Router();

productRouter.get('/search', searchProducts)
productRouter.route("/").get(getProducts).post(createProduct);
productRouter.route("/:productId").get(getProductById);

productRouter.patch("/update/:productId/:tailorId", updateProduct);
productRouter.delete("/delete/:productId/:tailorId", deleteProduct);


export default productRouter;
