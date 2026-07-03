export interface Message {
    id: number;
    offer_id: number;

    sender_id: number;
    sender_name?: string;

    receiver_id: number;
    receiver_name?: string;

    content: string;
    is_read: boolean;

    created_at: Date;
}
