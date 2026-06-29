export interface TradeOffer {
    id: number;
    requester_id: number;
    target_item_id: number;
    target_title?: string;
    owner_name?: string;
    status: string;
    created_at: string;
    updated_at: string;
}