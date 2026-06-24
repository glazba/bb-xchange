import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOffer, getMyOffers, getMyReceivedOffers } from "../controllers/tradeOfferController";

const router = Router();


router.get("/me", authMiddleware, getMyOffers);

router.get("/received", authMiddleware, getMyReceivedOffers);

router.post("/", authMiddleware, createOffer);


export default router;