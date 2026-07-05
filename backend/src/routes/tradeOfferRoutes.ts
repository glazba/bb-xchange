import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createOffer,
    getMyOffers,
    getMyReceivedOffers,
    changeOfferStatus,
    revokeOffer,
    completeTrade,
    cancelAcceptedOffer
} from "../controllers/tradeOfferController";

const router = Router();

router.post("/", authMiddleware, createOffer);

router.get("/me", authMiddleware, getMyOffers);

router.get("/received", authMiddleware, getMyReceivedOffers);

router.put("/:id", authMiddleware, changeOfferStatus);

router.patch("/:id/revoke", authMiddleware, revokeOffer);

router.patch("/:id/complete", authMiddleware, completeTrade);

router.patch("/:id/cancel", authMiddleware, cancelAcceptedOffer);

export default router;