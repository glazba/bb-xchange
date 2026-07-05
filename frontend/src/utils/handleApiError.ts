import type { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

export const handleApiError = (
    error: unknown,
    navigate: NavigateFunction
) => {
    const status = (error as Error & {
        status?: number;
    }).status;

    if (status === 404) {
        navigate("/404");
        return;
    }

    if (status && status >= 500) {
        navigate("/500");
        return;
    }

    toast.error(
        error instanceof Error
            ? error.message
            : "Valami hiba történt."
    );
};
