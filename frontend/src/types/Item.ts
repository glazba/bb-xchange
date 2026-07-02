import type { ItemImage } from "./ItemImage";

export interface Item {
    id: number;
    owner_id: number;
    owner_name?: string;

    cover_image?: string | null;
    images?: ItemImage[];

    title: string;
    description: string;
    item_condition: string;
    type: string;
    status: string;

    created_at?: string;
    updated_at?: string;

    // Book details
    author?: string;
    genre?: string;
    page_count?: number;
    published_year?: number;
    isbn?: string;

    // Boardgame details
    min_players?: number;
    max_players?: number;
    recommended_age?: number;
    playtime?: number;
}