export interface Notification {
    id: number;
    type: "new_offer" | "offer_accepted" | "offer_rejected";
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}
