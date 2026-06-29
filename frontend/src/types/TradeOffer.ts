export interface TradeOffer {
    id: number;
    requester_id: number;
    requester_name: string;

    target_item_id: number;
    target_title: string;

    offered_items: string[];
    
    owner_name?: string;
    status: string;
    created_at: string;
    updated_at: string;
}