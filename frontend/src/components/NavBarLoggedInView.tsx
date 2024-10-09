import { Link } from "react-router-dom";
import { User } from "../models/user";
import * as BooksApi from "../network/books_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await BooksApi.logOut();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
      <>
        <Link to="/favorites" className="hover:underline text-white">
          Favorites
        </Link>
        <span className="mr-2">Signed in as: {user.username}</span>
        <button
          onClick={logout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
      </>
    );
}

export default NavBarLoggedInView;