export interface Item {
    id: number,
    owner_id: number;
    owner_name?: string;

    title: string;
    description: string;

    type: string;
    item_condition: string;
    status: string;

    created_at?: string;
    updated_at?: string;
}