import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import {
    createTradeOffer,
    createOfferItem,
    getOfferItems,
    getOffersByRequesterId,
    getReceivedOffers,
    getOfferById,
    updateOfferStatus,
    cancelOtherOffers,
    cancelOffersContainingItem,
    revokeOffer as revokeOfferService
} from "../services/tradeOffersService";
import { getItemById, updateItemStatus } from "../services/itemService";

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
            String(targetItemId)
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
                String(itemId)
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

        return res.status(201).json({
            message: "Offer created",
            offerId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
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

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
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

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
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
            String(req.params.id)
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
            String(offer[0].target_item_id)
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
            String(req.params.id),
            status
        );

        if (status === "accepted") {
            await updateItemStatus(
                String(offer[0].target_item_id),
                "traded"
            );

            // Delete every offer containing this item
            await cancelOffersContainingItem(
                offer[0].target_item_id,
                Number(req.params.id)
            );

            const offerItems = await getOfferItems(
                String(req.params.id)
            );

            for (const item of offerItems) {
                await updateItemStatus(
                    String(item.item_id),
                    "traded"
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

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
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
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
