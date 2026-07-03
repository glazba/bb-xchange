export interface Conversation {
    user_id: number;
    username: string;
    avatar: string | null;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}