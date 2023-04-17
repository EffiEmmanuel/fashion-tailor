import mongoose from "mongoose";

const User = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    ],
    likedProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", User);
export default UserModel;
