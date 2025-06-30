const express = require("express");
const productRouter = express.Router();
const upload = require("../config/multer");
const {
  createProducts,
  updateProductController,
  fetchProductsController,
  deleteProductsController,
  uploadImage,
} = require("../controllers/productsController");
const searchProductsController = require("../controllers/searchProductController");

productRouter.get("/search", searchProductsController);
productRouter.get("/", fetchProductsController);
productRouter.post("/create", createProducts);
productRouter.put("/update/:id", updateProductController);
productRouter.delete("/:id", deleteProductsController);


productRouter.post(
  "/upload",
  upload.single("image"),
  uploadImage
);

module.exports=productRouter;