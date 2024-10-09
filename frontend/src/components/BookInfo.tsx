import { useForm } from "react-hook-form";
import { Book as BookModel } from "../models/book";
import { BookUpdate } from "../network/books_api";
import * as BooksApi from "../network/books_api";
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

interface BookInfoDialogProps {
    isFavoritePage: boolean;
    book: BookModel;
    isLogged: boolean;
    onDismiss: () => void;
    onDeleteBook: (book: BookModel) => void;
    refreshBooks: () => void;        
}

const BookInfoDialog = ({isLogged,isFavoritePage, book, onDismiss, refreshBooks, onDeleteBook}: BookInfoDialogProps) => {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onDismiss();
        }
    };

    const { register, handleSubmit, formState : {errors, isSubmitting}} = useForm<BookUpdate>({
      defaultValues: {
        review: book?.review || "",
      }
    });

    async function onSubmit(input: BookUpdate){
        try {
            const bookResponse = await BooksApi.updateBook(book._id, input);
            console.log(bookResponse);
            refreshBooks();
            onDismiss();
            Swal.fire({
                title: 'Review saved',
                icon: 'success',
            });
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    async function addToFavorites(){
        try {
            const bookResponse = await BooksApi.createBook(book);
            console.log(bookResponse);
            Swal.fire({
                title: 'Book added to favorites',
                icon: 'success',
            });
            onDismiss();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
      async function checkIfFavorite(){
        try {
          if (isLogged) {
            const favorites = await BooksApi.getBooks();
            const favorite = favorites.find((favorite) => favorite.ebook === book.ebook);
            setIsFavorite(!!favorite);
          }
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
      checkIfFavorite();
    }, [book.ebook, isLogged]);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-8"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-800 p-4 sm:p-8 rounded-lg w-full max-w-3xl relative">
          <button
            className="absolute top-2 right-2 text-white"
            onClick={onDismiss}
          >
            &times;
          </button>
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <img
              src={book.cover}
              alt={book.title}
              className="w-40 h-56 sm:w-56 sm:h-72 object-fill mb-4 sm:mb-0 sm:mr-4"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-white">
                {book.title}
              </h2>
              <p className="text-gray-300">by {book.authors.join(", ")}</p>
              <div className="mt-4">
                <p className="text-gray-300">
                  Genre:{" "}
                  <span className="font-semibold text-white">{book.genre}</span>
                </p>
                <p className="text-gray-300">
                  Languages:{" "}
                  <span className="font-semibold text-white">
                    {book.languages.join(", ")}
                  </span>
                </p>
                <p className="text-gray-300">
                  Downloads:{" "}
                  <span className="font-semibold text-white">
                    {book.downloads}
                  </span>
                </p>
                <div className="mt-2">
                  <p className="text-gray-300">Subjects:</p>
                  <div className="flex flex-wrap justify-center sm:justify-start mt-1">
                    {book.subjects.map((subject, index) => {
                      const colors = [
                        "bg-blue-300",
                        "bg-green-300",
                        "bg-red-300",
                        "bg-yellow-300",
                        "bg-purple-300",
                      ];
                      const color = colors[index % colors.length];
                      return (
                        <span
                          key={index}
                          className={`${color} text-gray-800 px-2 py-1 rounded-full text-sm mr-2 mb-2`}
                        >
                          {subject}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isFavoritePage && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="mb-4">
                <label htmlFor="review" className="block text-gray-300 mb-2">
                  Review
                </label>
                <textarea
                  id="review"
                  {...register("review", { required: "Review is required" })}
                  defaultValue={book?.review || ""}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  placeholder="Write your review here..."
                />
                {errors.review && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.review.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : book.review ? "Update Review" : "Save Review"}
              </button>
            </form>
          )}
          <footer className="mt-8 flex flex-col sm:flex-row justify-end">
            {isFavoritePage && (
              <button
                className="flex items-center justify-center px-4 py-2 rounded-lg mb-2 sm:mb-0 sm:mr-2 bg-gray-600 hover:bg-gray-700"
                onClick={(e) => {
                  onDeleteBook(book);
                  e.stopPropagation();
                }}
              >
                <MdDelete className="text-red-500 cursor-pointer text-2xl hover:text-red-700" />
              </button>
            )}

            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2 sm:mb-0 sm:mr-2 hover:bg-green-600 w-full sm:w-auto"
              onClick={() => window.open(book.ebook, "_blank")}
            >
              eBook
            </button>
            {!isFavoritePage && (
                <button
                className={`px-4 py-2 rounded-lg w-full sm:w-auto ${
                  isFavorite
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
                }`}
                onClick={() => {
                  if (!isLogged) {
                  Swal.fire({
                    title: 'Please log in to add to favorites',
                    icon: 'warning',
                  });
                  } else {
                  addToFavorites();
                  }
                }}
                disabled={isFavorite}
                >
                {isFavorite ? "Already in Favorites" : "Add to Favorites"}
                </button>
            )}
          </footer>
        </div>
      </div>
    );
}
 
export default BookInfoDialog;