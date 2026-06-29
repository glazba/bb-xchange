export interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    city: string;
    bio?: string;
    interests: string[];
    created_at: string;
    updated_at: string;
}
