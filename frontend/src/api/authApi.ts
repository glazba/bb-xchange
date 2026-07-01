import { API_URL } from "./apiConfig";

//! Login
export const loginUser = async (
    email: string,
    password: string
) => {

    const response = await fetch(
        `http://localhost:3000/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    console.log(response.status);


    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

//! Register
export const registerUser = async (
    username: string,
    email: string,
    password: string,
    city: string,
    bio: string,
    interests: string[]
) => {

    const response = await fetch(
        `${API_URL}/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                city,
                bio,
                interests
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};
