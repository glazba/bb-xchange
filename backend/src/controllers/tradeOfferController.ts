import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";

/* import { messages } from "../utils/messages"; */
import { handleControllerError } from "../utils/handleControllerErrors";
import {
    createTradeOffer,
    createOfferItem,
    getOfferItems,
    getOffersByRequesterId,
    getReceivedOffers,
    getOfferById,
    updateOfferStatus,
    cancelOffersContainingItem,
    revokeOffer as revokeOfferService,
    completeOffer
} from "../services/tradeOffersService";

import { getItemById, updateItemStatus } from "../services/itemService";

import { createNotification } from "../services/notificationService";

//! Create offer
export const createOffer = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const {
            targetItemId,
            offeredItemIds
        } = req.body;

        const requesterId = req.user!.userId;

        const targetItem = await getItemById(
            Number(targetItemId)
        );

        //! Does target item exist?
        if (!targetItem) {
            return res.status(404).json({
                message: "Target item not found"
            });
        }

        //! Item is not active
        if (targetItem.status !== "active") {
            return res.status(400).json({
                message: "This item is no longer available"
            });
        }

        //! Cannot offer empty item.
        if (!Array.isArray(offeredItemIds) || offeredItemIds.length === 0) {
            return res.status(400).json({
                message: "At least one offered item is required"
            });
        }

        //! Cannot offer on own item.
        if (targetItem.owner_id === requesterId) {
            return res.status(400).json({
                message: "You cannot make an offer on your own item"
            });
        }

        //! Target item cannot be offered.
        if (offeredItemIds.includes(targetItemId)) {
            return res.status(400).json({
                message: "Target item cannot be offered"
            });
        }

        //! Validate items
        for (const itemId of offeredItemIds) {

            const offeredItem = await getItemById(
                Number(itemId)
            );

            if (!offeredItem) {
                return res.status(404).json({
                    message: `Item ${itemId} not found`
                });
            }

            if (offeredItem.owner_id !== requesterId) {
                return res.status(403).json({
                    message: "You can only offer your own items"
                });
            }

            if (offeredItem.status !== "active") {
                return res.status(400).json({
                    message: "You can only offer active items"
                });
            }
        }

        //! Create offer
        const offerId = await createTradeOffer(
            requesterId,
            targetItemId
        );

        //! Create offer items
        for (const itemId of offeredItemIds) {
            await createOfferItem(
                offerId,
                itemId
            );
        }

        await createNotification(
            targetItem.owner_id,
            "new_offer",
            "Új ajánlatod érkezett!",
            "/offers/received"
        );

        return res.status(201).json({
            message: "Offer created",
            offerId
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get offers by requester
export const getMyOffers = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const offers = await getOffersByRequesterId(
            req.user!.userId
        );

        return res.json(offers);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get received offers
export const getMyReceivedOffers = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const offers = await getReceivedOffers(
            req.user!.userId
        );

        return res.json(offers);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Modify offer status
export const changeOfferStatus = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const {
            status
        } = req.body;

        const allowedStatuses = [
            "pending",
            "accepted",
            "rejected",
            "cancelled"
        ];

        //! Allowed status?
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const offer = await getOfferById(
            Number(req.params.id)
        );

        //! Does offer exist?
        if (offer.length === 0) {
            return res.status(404).json({
                message: "Offer not found"
            });
        }

        //! Only pending offers can be modified
        if (offer[0].status !== "pending") {
            return res.status(400).json({
                message: "Offer is already closed"
            });
        }

        const item = await getItemById(
            Number(offer[0].target_item_id)
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.owner_id !== req.user!.userId) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        await updateOfferStatus(
            Number(req.params.id),
            status
        );

        if (status === "accepted") {
            await createNotification(
                offer[0].requester_id,
                "offer_accepted",
                "Elfogadták az ajánlatod. A termékek foglalás alá kerültek.",
                "/offers"
            );
        }

        if (status === "rejected") {
            await createNotification(
                offer[0].requester_id,
                "offer_rejected",
                "Elutasították az ajánlatod.",
                "/offers"
            );
        }

        if (status === "accepted") {
            await updateItemStatus(
                Number(offer[0].target_item_id),
                "reserved"
            );

            // Delete every offer containing this item
            await cancelOffersContainingItem(
                offer[0].target_item_id,
                Number(req.params.id)
            );

            const offerItems = await getOfferItems(
                Number(req.params.id)
            );

            for (const item of offerItems) {
                await updateItemStatus(
                    Number(item.item_id),
                    "reserved"
                );

                // Delete every other offer containing this item
                await cancelOffersContainingItem(
                    item.item_id,
                    Number(req.params.id)
                );
            }
        }

        return res.json({
            message: "Offer updated"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const revokeOffer = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const offerId = Number(req.params.id);
        const requesterId = req.user!.userId;

        const success = await revokeOfferService(
            offerId,
            requesterId
        );

        if (!success) {
            return res.status(404).json({
                message: "Offer not found or cannot be revoked"
            });
        }

        return res.json({
            message: "Offer revoked successfully"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const completeTrade = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const offerId = Number(req.params.id);

        const offer = await getOfferById(offerId);

        if (offer.length === 0) {
            return res.status(404).json({
                message: "Offer not found"
            });
        }

        const tradeOffer = offer[0];

        if (tradeOffer.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted offers can be completed"
            });
        }

        const targetItem = await getItemById(
            tradeOffer.target_item_id
        );

        if (!targetItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (targetItem.owner_id !== req.user!.userId) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        await completeOffer(offerId);

        await updateItemStatus(
            tradeOffer.target_item_id,
            "traded"
        );

        const offerItems = await getOfferItems(offerId);

        for (const item of offerItems) {
            await updateItemStatus(
                item.item_id,
                "traded"
            );
        }

        await createNotification(
            tradeOffer.requester_id,
            "offer_completed",
            "A csere sikeresen lezárult!",
            "/offers"
        );

        return res.json({
            message: "Trade completed"
        });
    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

export const cancelAcceptedOffer = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const offerId = Number(req.params.id);

        const offer = await getOfferById(
            offerId
        );

        if (offer.length === 0) {
            return res.status(404).json({
                message: "Offer not found",
            });
        }

        if (offer[0].status !== "accepted") {
            return res.status(400).json({
                message:
                    "Only accepted offers can be cancelled.",
            });
        }

        const targetItem =
            await getItemById(
                offer[0].target_item_id
            );

        if (!targetItem) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        if (
            targetItem.owner_id !==
            req.user!.userId
        ) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        await updateOfferStatus(
            offerId,
            "cancelled"
        );

        await updateItemStatus(
            offer[0].target_item_id,
            "active"
        );

        const offerItems =
            await getOfferItems(offerId);

        for (const item of offerItems) {
            await updateItemStatus(
                item.item_id,
                "active"
            );
        }

        await createNotification(
            offer[0].requester_id,
            "offer_cancelled",
            "A csere meghiúsult.",
            "/offers"
        );

        return res.json({
            message:
                "Offer cancelled successfully",
        });
    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};