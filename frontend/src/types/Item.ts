export interface Item {
    id: number;
    owner_id: number;
    owner_name?: string;

    cover_image?: string;

    title: string;
    description: string;

    type: string;
    item_condition: string;

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