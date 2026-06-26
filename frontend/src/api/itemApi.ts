export const getMyItems = async (
    token: string
) => {

    const response = await fetch(
        "http://localhost:3000/items/me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    return data;
};

export const createItem = async (
    token: string,
    type: string,
    title: string,
    description: string,
    itemCondition: string
) => {

    const response = await fetch(
        "http://localhost:3000/items",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type,
                title,
                description,
                itemCondition
            })
        }
    );

    const data = await response.json();

    return data;
};
