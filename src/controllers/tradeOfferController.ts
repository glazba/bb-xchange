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

    const offerId = await createTradeOffer(
        requesterId,
        targetItemId
    );

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

    const offer = await getOfferById(
        String(req.params.id)
    );

    if (offer.length === 0) {
        return res.status(404).json({
            message: "Offer not found"
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