import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export const createTradeOffer = async (
    requesterId: number,
    targetItemId: number
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        
        INSERT INTO trade_offers(
            requester_id,
            target_item_id
        )
        VALUES (?, ?)
        `,
        [
            requesterId,
            targetItemId
        ]
    );

    return result.insertId;
};


export const createOfferItem = async (
    offerId: number,
    itemId: number
) => {
    await pool.query(
        `
        INSERT INTO offer_items (
            offer_id,
            item_id
        )
        VALUES (?, ?)
        `,
        [
            offerId,
            itemId
        ]
    );
};

export const getOffersByRequesterId = async (
    requesterId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            requester_id,
            target_item_id,
            status,
            created_at,
            updated_at
        FROM trade_offers
        WHERE requester_id = ?
        ORDER BY created_at DESC
        `,
        [requesterId]
    );

    return rows;
};

export const getReceivedOffers = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            trade_offers.id,
            trade_offers.requester_id,
            trade_offers.target_item_id,
            trade_offers.status,
            trade_offers.created_at,
            trade_offers.updated_at
        FROM trade_offers
        INNER JOIN items
            ON trade_offers.target_item_id = items.id
        WHERE items.owner_id = ?
        ORDER BY trade_offers.created_at DESC
        `,
        [userId]
    );

    return rows;
};

