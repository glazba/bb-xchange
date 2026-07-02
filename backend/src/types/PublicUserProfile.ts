export interface PublicUserProfile {
    id: number;
    username: string;
    avatar: string | null;
    city: string;
    bio: string | null;
    interests: string[];
    created_at: Date;
}
