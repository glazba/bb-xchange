import { Request, Response } from "express";
import { createBookDetails, getBookByItemId } from "../services/bookService";

/* import { messages } from "../utils/messages"; */
import { handleControllerError } from "../utils/handleControllerErrors";

//! Create book
export const createBook = async (
    req: Request,
    res: Response
) => {

    try {
        const {
            itemId,
            author,
            genre,
            pageCount,
            publishedYear,
            isbn
        } = req.body;

        await createBookDetails(
            itemId,
            author,
            genre,
            pageCount,
            publishedYear,
            isbn
        );

        return res.status(201).json({
            message: "Book details created"
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get book by ID
export const getBook = async (
    req: Request,
    res: Response
) => {

    try {
        const book = await getBookByItemId(
            Number(req.params.itemId)
        );

        if (book.length === 0) {
            return res.status(404).json({
                message: "Book details not found"
            });
        }

        return res.json(book[0]);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};
