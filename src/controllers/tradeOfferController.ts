import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { createTradeOffer, createOfferItem, getOffersByRequesterId, getReceivedOffers } from "../services/tradeOffersService";


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

