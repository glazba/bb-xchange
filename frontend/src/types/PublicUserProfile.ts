import type { User } from "./User";

export interface PublicUserProfile extends User {
    bio?: string | null;
    interests: string[];
    created_at: string;
}
