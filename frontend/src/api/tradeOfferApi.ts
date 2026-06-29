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

    return response.json();
};

export const getMyOffers = async (
    token: string,
) => {
    const response = await fetch(
        "http://localhost:3000/offers/me",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    return response.json();
};

export const getReceivedOffers = async (
    token: string,
) => {
    const response = await fetch(
        "http://localhost:3000/offers/received",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );

    return response.json();
};
