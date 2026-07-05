import type { TradeOffer } from "../types/TradeOffer";
import { API_URL } from "./apiConfig";

export const createOffer = async (
    token: string,
    targetItemId: number,
    offeredItemIds: number[]
) => {

    const response = await fetch(
        `${API_URL}/offers`,
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
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const getMyOffers = async (
    token: string,
): Promise<TradeOffer[]> => {
    const response = await fetch(
        `${API_URL}/offers/me`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const getReceivedOffers = async (
    token: string,
): Promise<TradeOffer[]> => {
    const response = await fetch(
        `${API_URL}/offers/received`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const updateOfferStatus = async (
    token: string,
    offerId: number,
    status: string
) => {

    const response = await fetch(
        `${API_URL}/offers/${offerId}`,
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
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
}

export const revokeOffer = async (
    token: string,
    offerId: number
) => {

    const response = await fetch(
        `${API_URL}/offers/${offerId}/revoke`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const completeOffer = async (
    token: string,
    offerId: number
) => {
    const response = await fetch(
        `${API_URL}/offers/${offerId}/complete`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const cancelAcceptedOffer =
  async (
    token: string,
    offerId: number
  ) => {
    const response = await fetch(
      `${API_URL}/offers/${offerId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message
      );
    }

    return data;
  };