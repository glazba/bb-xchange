import type { User } from "./User";

export interface UserProfile extends User {
    email: string;
    bio?: string | null;
    interests: string[];
    created_at: string;
    updated_at: string;
}
