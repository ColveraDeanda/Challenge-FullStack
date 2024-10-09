import express from "express";
import * as BooksController from "../controllers/books";

const router = express.Router();

router.get("/", BooksController.getBooks);
router.get("/:id", BooksController.getBook);
router.post("/", BooksController.createBook);
router.patch("/:id", BooksController.updateBook);
router.delete("/:id", BooksController.deleteBook);

export default router;