export const timeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);

    const diffInSeconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
        return "Épp most";
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
        return `${minutes} perce`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} órája`;
    }

    const days = Math.floor(hours / 24);

    return `${days} napja`;
};
