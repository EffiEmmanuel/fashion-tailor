import mongoose from "mongoose";

const Tailor = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telephoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      // required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const TailorModel = mongoose.model("Tailor", Tailor);
export default TailorModel;
