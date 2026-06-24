import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOffer, getMyOffers, getMyReceivedOffers, changeOfferStatus } from "../controllers/tradeOfferController";

const router = Router();


router.get("/me", authMiddleware, getMyOffers);

router.get("/received", authMiddleware, getMyReceivedOffers);

router.put("/:id", authMiddleware, changeOfferStatus);

router.post("/", authMiddleware, createOffer);


export default router;