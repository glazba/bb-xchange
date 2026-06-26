import { Request, Response } from "express";
import { createBoardgameDetails, getBoardgameByItemId } from "../services/boardgameService";

//! Create boardgame
export const createBoardgame = async (
    req: Request,
    res: Response
) => {

    const {
        itemId,
        genre,
        minPlayers,
        maxPlayers,
        recommendedAge,
        playtime
    } = req.body;

    await createBoardgameDetails(
        itemId,
        genre,
        minPlayers,
        maxPlayers,
        recommendedAge,
        playtime
    );

    res.status(201).json({
        message: "Boardgame details created"
    });
};

//! Get boardgame by ID
export const getBoardgame = async (
    req: Request,
    res: Response
) => {

    const boardgame = await getBoardgameByItemId(
        String(req.params.itemId)
    );

    if (boardgame.length === 0) {
        return res.status(404).json({
            message: "Boardgame not found"
        });
    }

    res.json(boardgame[0]);
};
