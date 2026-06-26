import { Request, Response } from "express";
import { createBookDetails, getBookByItemId } from "../services/bookService";

//! Create book
export const createBook = async (
    req: Request,
    res: Response
) => {

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

    res.status(201).json({
        message: "Book details created"
    });
};

//! Get book by ID
export const getBook = async (
    req: Request,
    res: Response
) => {

    const book = await getBookByItemId(
        String(req.params.itemId)
    );

    if (book.length === 0) {
        return res.status(404).json({
            message: "Book details not found"
        });
    }

    res.json(book[0]);
};
