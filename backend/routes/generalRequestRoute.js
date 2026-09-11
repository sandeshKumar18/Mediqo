import express from "express";

import authUser from "../middlewares/authUser.js";
import {
  createGeneralRequest,
  verifyGeneralRequestPayment,
  getMyGeneralRequest,
  getLiveGeneralQueue,
  getGeneralRequestHistory,
} from "../controllers/generalRequestController.js";

const generalRequestRouter = express.Router();

generalRequestRouter.post("/create",authUser,createGeneralRequest);
generalRequestRouter.post("/verify-payment",authUser,verifyGeneralRequestPayment);
generalRequestRouter.get("/my-request",authUser,getMyGeneralRequest);
generalRequestRouter.get("/live-queue",getLiveGeneralQueue);
generalRequestRouter.get("/history",authUser,getGeneralRequestHistory);

export default generalRequestRouter;
