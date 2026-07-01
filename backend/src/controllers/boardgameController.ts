import { Request, Response } from "express";
import { createBoardgameDetails, getBoardgameByItemId } from "../services/boardgameService";

/* import { messages } from "../utils/messages"; */
import { handleControllerError } from "../utils/handleControllerErrors";

//! Create boardgame
export const createBoardgame = async (
    req: Request,
    res: Response
) => {

    try {
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

        return res.status(201).json({
            message: "Boardgame details created"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get boardgame by ID
export const getBoardgame = async (
    req: Request,
    res: Response
) => {

    try {
        const boardgame = await getBoardgameByItemId(
            Number(req.params.itemId)
        );

        if (boardgame.length === 0) {
            return res.status(404).json({
                message: "Boardgame not found"
            });
        }

        return res.json(boardgame[0]);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};
