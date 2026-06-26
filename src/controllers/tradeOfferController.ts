import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { createTradeOffer, createOfferItem, getOffersByRequesterId, getReceivedOffers, getOfferById, updateOfferStatus } from "../services/tradeOffersService";
import { getItemById } from "../services/itemService";


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

    //! Üres listát ne lehessen küldeni
    if (!Array.isArray(offeredItemIds) || offeredItemIds.length === 0) {
        return res.status(400).json({
            message: "At least one offered item is required"
        });
    }

    //! Target item létezik?
    if (targetItem.length === 0) {
        return res.status(404).json({
            message: "Target item not found"
        });
    }

    //! Saját itemre ne lehessen ajánlatot tenni
    if (targetItem[0].owner_id === requesterId) {
        return res.status(400).json({
            message: "You cannot make an offer on your own item"
        });
    }

    //! A target item ne lehessen az offered listában
    if (offeredItemIds.includes(targetItemId)) {
        return res.status(400).json({
            message: "Target item cannot be offered"
        });
    }

    //! Minden felajánlott item validálása
    for (const itemId of offeredItemIds) {

        const offeredItem = await getItemById(
            String(itemId)
        );

        if (offeredItem.length === 0) {
            return res.status(404).json({
                message: `Item ${itemId} not found`
            });
        }

        if (offeredItem[0].owner_id !== requesterId) {
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


export const getMyOffers = async (
    req: AuthRequest,
    res: Response
) => {

    const offers = await getOffersByRequesterId(
        req.user!.userId
    );

    res.json(offers);
};


export const getMyReceivedOffers = async (
    req: AuthRequest,
    res: Response
) => {

    const offers = await getReceivedOffers(
        req.user!.userId
    );

    res.json(offers);
};


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

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    const offer = await getOfferById(
        String(req.params.id)
    );

    if (offer.length === 0) {
        return res.status(404).json({
            message: "Offer not found"
        });
    }

    if (offer[0].status !== "pending") {
        return res.status(400).json({
            message: "Offer is already closed"
        });
    }

    const item = await getItemById(
        String(offer[0].target_item_id)
    );

    if (item[0].owner_id !== req.user!.userId) {
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