import mongoose from "mongoose";

const Product = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    typeOfMaterialNeeded: {
      type: String,
      required: true,
    },
    productionDuration: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true
    },
    tailor: {
      type: mongoose.Types.ObjectId,
      ref: "Tailor",
      required: false,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", Product);
export default ProductModel;
