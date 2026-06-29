import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//! Create offer
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

//! Create offer item
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

//! Get offer items
export const getOfferItems = async (
    offerId: string
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT item_id
        FROM offer_items
        WHERE offer_id = ?
        `,
        [offerId]
    );

    return rows;
};

//! Get offers by requestor
export const getOffersByRequesterId = async (
    requesterId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            trade_offers.id,
            trade_offers.requester_id,
            trade_offers.target_item_id,
            items.title AS target_title,
            users.username AS owner_name,
            trade_offers.status,
            trade_offers.created_at,
            trade_offers.updated_at
        FROM trade_offers
        INNER JOIN items
            ON trade_offers.target_item_id = items.id
        INNER JOIN users
            ON items.owner_id = users.id
        WHERE trade_offers.requester_id = ?
        ORDER BY trade_offers.created_at DESC
        `,
        [requesterId]
    );

    return rows;
};

//! Get received offers
export const getReceivedOffers = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            trade_offers.id,
            trade_offers.requester_id,
            users.username AS requester_name,
            trade_offers.target_item_id,
            target.title AS target_title,
            trade_offers.status,
            trade_offers.created_at,
            trade_offers.updated_at,
            GROUP_CONCAT(
                offered.title
                ORDER BY offered.title
                SEPARATOR '||'
                ) AS offered_items
        FROM trade_offers

        INNER JOIN items target
            ON trade_offers.target_item_id = target.id
        INNER JOIN users
            ON trade_offers.requester_id = users.id
        INNER JOIN offer_items
            ON trade_offers.id = offer_items.offer_id
        INNER JOIN items offered
            ON offer_items.item_id = offered.id

        WHERE target.owner_id = ?

        GROUP BY trade_offers.id

        ORDER BY trade_offers.created_at DESC
        `,
        [userId]
    );

    return rows.map((offer) => ({
        ...offer,
        offered_items: offer.offered_items
            ? offer.offered_items.split("||")
            : [],
    }));
};

//! Get offer by ID
export const getOfferById = async (
    offerId: string //? Number?
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            id,
            requester_id,
            target_item_id,
            status
        FROM trade_offers
        WHERE id = ?
        `,
        [offerId]
    );

    return rows;
};

//! Modify offer status
export const updateOfferStatus = async (
    offerId: string,
    status: string
) => {

    await pool.query(
        `
        UPDATE trade_offers
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            offerId
        ]
    );
};

//! Cancel offers
export const cancelOtherOffers = async (
    targetItemId: number,
    acceptedOfferId: number
) => {
    await pool.query(
        `
        UPDATE trade_offers
        SET status = 'cancelled'
        WHERE target_item_id = ?
        AND id != ?
        AND status = 'pending'
        `,
        [
            targetItemId,
            acceptedOfferId
        ]
    );
};
