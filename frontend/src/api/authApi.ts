//! Login
export const loginUser = async (
    email: string,
    password: string
) => {

    const response = await fetch(
        "http://localhost:3000/users/login",
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

    const data = await response.json();

    return data;
};

//! Register
export const registerUser = async (
    username: string,
    email: string,
    password: string,
    city: string
) => {

    const response = await fetch(
        "http://localhost:3000/users/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                city
            })
        }
    );

    const data = await response.json();

    return data;
};
