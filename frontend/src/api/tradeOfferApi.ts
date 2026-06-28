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
                "Content-Type": "apllication/json",
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
