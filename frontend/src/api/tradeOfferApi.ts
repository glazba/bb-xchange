import type { TradeOffer } from "../types/TradeOffer";

export const createOffer = async (
    token: string,
    targetItemId: number,
    offeredItemIds: number[]
) => {

    const response = await fetch(
        "http://localhost:3000/offers",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                targetItemId,
                offeredItemIds,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getMyOffers = async (
    token: string,
): Promise<TradeOffer[]> => {
    const response = await fetch(
        "http://localhost:3000/offers/me",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getReceivedOffers = async (
    token: string,
): Promise<TradeOffer[]> => {
    const response = await fetch(
        "http://localhost:3000/offers/received",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const updateOfferStatus = async (
    token: string,
    offerId: number,
    status: string
) => {

    const response = await fetch(
        `http://localhost:3000/offers/${offerId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}
