import { RequestHandler } from "express";
import BookModel from "../models/book";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getBooks: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);

        const books = await BookModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(books);
    } catch (err) {
        next(err);
    }
};

export const getBook: RequestHandler = async (req, res, next) => {
    const bookId = req.params.id;
    const authenticatedUserId = req.session.userId;
    try{
        assertIsDefined(authenticatedUserId);
        if(!mongoose.isValidObjectId(bookId)) {
            throw createHttpError(400, "Invalid ID");
        }

        const book = await BookModel.findById(bookId).exec();

        if (!book) {
            throw createHttpError(404, "Book not found");
        }

        if (!book.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this book");
        }

        res.status(200).json(book);
    } catch (err) {
        next(err);
    }
};

interface CreateBookBody {
    title?: string,
    authors?: string[];
    review?: string;
    cover?: string,
    ebook?: string,
    genre?: string,
    downloads?: number,
    subjects?: string[];
    languages?: string[];
}

export const createBook: RequestHandler<unknown, unknown, CreateBookBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const authors = req.body.authors;
    const review = req.body.review;
    const cover = req.body.cover;
    const ebook = req.body.ebook;
    const genre = req.body.genre;
    const downloads = req.body.downloads;
    const subjects = req.body.subjects;
    const languages = req.body.languages;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!title) {
            throw createHttpError(400, "Book should have title");
        }
        if(!authors) {
            throw createHttpError(400, "Book should have author");
        }
        if(!cover) {
            throw createHttpError(400, "Book should have cover");
        }
        if(!ebook) {
            throw createHttpError(400, "Book should have ebook");
        }
        if(!genre) {
            throw createHttpError(400, "Book should have genre");
        }
        if(!downloads) {
            throw createHttpError(400, "Book should have downloads");
        }
        if(!subjects) {
            throw createHttpError(400, "Book should have subjects");
        }
        if(!languages) {
            throw createHttpError(400, "Book should have languages");
        }
        
        const newBook = await BookModel.create({
            userId: authenticatedUserId,
            title: title,
            authors: authors,
            review: review,
            cover: cover,
            ebook: ebook,
            genre: genre,
            downloads: downloads,
            subjects: subjects,
            languages: languages,
        });

        res.status(201).json(newBook);
    } catch (err) {
        next(err);
    }
};

interface UpdatebookParams {
    id: string
}

interface UpdateBookBody {
    review: string;
}

export const updateBook: RequestHandler<UpdatebookParams, unknown, UpdateBookBody, unknown> = async(req, res, next) => {
    const bookId = req.params.id;
    const review = req.body.review;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(bookId)) {
            throw createHttpError(400, "Invalid ID");
        }

        const book = await BookModel.findById(bookId).exec();

        if (!book) {
            throw createHttpError(404, "Book not found");
        }

        if (!book.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this book");
        }
        
        book.review = review;

        const updatedBook = await book.save();

        res.status(200).json(updatedBook);

    } catch(error) {
        next(error);
    }
}

export const deleteBook: RequestHandler = async (req, res, next) => {
    const bookId = req.params.id;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(bookId)) {
            throw createHttpError(400, "Invalid ID");
        }

        const book = await BookModel.findById(bookId).exec();

        if (!book) {
            throw createHttpError(404, "book not found");
        }

        if (!book.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this book");
        }

        await book.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};