import { useEffect, useState } from "react";
import * as booksApi from "./network/books_api";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FavoritePage from "./pages/favorites";
import BooksPage from "./pages/books";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
	async function fetchLoggedInUser() {
		try {
			const user = await booksApi.getLogInUser();
			setLoggedInUser(user);
		} catch (error) {
			console.error(error);
		}
	}
	fetchLoggedInUser();
  }, []);

  return (
	<BrowserRouter>
		<Navbar
		  loggedInUser={loggedInUser}
		  onLoginClicked={() => {
			setShowLoginModal(true);
			setShowSignUpModal(false);
		  }}
		  onSignUpClicked={() => {
			setShowSignUpModal(true);
			setShowLoginModal(false);
		  }}
		  onLogoutSuccessful={() => setLoggedInUser(null)}
		/>
		<Routes>
		  <Route path="/" element={<BooksPage loggedInUser={loggedInUser}/>}/>
		  <Route path="/favorites" element={<FavoritePage loggedInUser={loggedInUser} />} />
		</Routes>
		{showSignUpModal && (
		  <SignUpModal
			onDismiss={() => setShowSignUpModal(false)}
			onSignUpSuccessful={(user) => {
			  setLoggedInUser(user);
			  setShowSignUpModal(false);
			}}
		  />
		)}
		{showLoginModal && (
		  <LoginModal
			onDismiss={() => setShowLoginModal(false)}
			onLoginSuccessful={(user) => {
			  setLoggedInUser(user);
			  setShowLoginModal(false);
			}}
		  />
		)}

	</BrowserRouter>
  );
}

export default App;
