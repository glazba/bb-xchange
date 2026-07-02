export interface TradeOffer {
    id: number;
    owner_id?: number;
    owner_name?: string;

    requester_id: number;
    requester_name: string;

    target_item_id: number;
    target_title: string;

    offered_items: string[];

    status: string;
    created_at: string;
    updated_at: string;
}