import express from "express";
import {
  createTailor,
  deleteTailor,
  getTailorByEmail,
  getTailorById,
  getTailorProducts,
  getTailors,
  loginTailor,
  updateTailor,
  verifyToken,
} from "../controller/Tailor.contrtoller.js";
const tailorRouter = express.Router();

tailorRouter.route("/").get(getTailors).post(createTailor);
tailorRouter.route("/:tailorId").get(getTailorById).patch(updateTailor).delete(deleteTailor);

tailorRouter.get('/get-products/:tailorId', getTailorProducts)

tailorRouter.post("/login", loginTailor);
tailorRouter.post("/verifyToken", verifyToken);
tailorRouter.get("/email/:tailorEmail", getTailorByEmail)

export default tailorRouter;
