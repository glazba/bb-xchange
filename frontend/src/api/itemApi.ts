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
