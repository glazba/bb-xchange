import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { createTradeOffer, createOfferItem, getOffersByRequesterId, getReceivedOffers, getOfferById, updateOfferStatus } from "../services/tradeOffersService";
import { getItemById } from "../services/itemService";

//! Create offer
export const createOffer = async (
    req: AuthRequest,
    res: Response
) => {

    const {
        targetItemId,
        offeredItemIds
    } = req.body;

    const requesterId = req.user!.userId;

    const targetItem = await getItemById(
        String(targetItemId)
    );

    //! Cannot offer empty item.
    if (!Array.isArray(offeredItemIds) || offeredItemIds.length === 0) {
        return res.status(400).json({
            message: "At least one offered item is required"
        });
    }

    //! Does target item exist?
    if (!targetItem) {
        return res.status(404).json({
            message: "Target item not found"
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

    res.status(201).json({
        message: "Offer created",
        offerId
    });
};

//! Get offers by requester
export const getMyOffers = async (
    req: AuthRequest,
    res: Response
) => {

    const offers = await getOffersByRequesterId(
        req.user!.userId
    );

    res.json(offers);
};

//! Get received offers
export const getMyReceivedOffers = async (
    req: AuthRequest,
    res: Response
) => {

    const offers = await getReceivedOffers(
        req.user!.userId
    );

    res.json(offers);
};

//! Modify offer status
export const changeOfferStatus = async (
    req: AuthRequest,
    res: Response
) => {

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

    res.json({
        message: "Offer updated"
    });
};
