import { Book as BookModel } from "../models/book";

interface BookProps {
    book: BookModel,
    onClick?: () => void;
}

const Book = ({ book, onClick }: BookProps) => {
    const { title, authors, cover: coverImage } = book;
    return (
      <div
        className="flex flex-col items-center max-w-48 bg-gray-800 shadow-md rounded-lg overflow-hidden text-center cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out"
        onClick={onClick}
      >
        <img
          className="w-full max-h-64 object-fill object-center"
          src={coverImage}
          alt={`Cover of ${title}`}
        />

        <div className="p-3.5 mt-auto">
          <h2 className="text-l font-semibold text-white">
            {title.length > 28 ? `${title.substring(0, 28)}...` : title}
          </h2>

          <p className="text-gray-400 mt-1 text-sm">
            {authors
              .map((author) =>
                author.length > 25 ? `${author.substring(0, 25)}...` : author
              )
              .join(", ")}
          </p>
        </div>
      </div>
    );
}

export default Book;