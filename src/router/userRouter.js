import express from "express";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
  verifyToken,
  addProductToCart,
} from "../controller/User.controllers.js";
const userRouter = express.Router();

userRouter.route("/").get(getUsers).post(createUser);
userRouter
  .route("/:userId")
  .get(getUserById)
  .delete(deleteUser)
  .put(updateUser);

userRouter.patch("products/like/:productId/:userId", addProductToCart);
userRouter.post("/login", loginUser);
userRouter.post("/verifyToken", verifyToken);
userRouter.get("/email/:userEmail", getUserByEmail);
userRouter.patch("add-to-cart/:productId/:userId", addProductToCart);

export default userRouter;
