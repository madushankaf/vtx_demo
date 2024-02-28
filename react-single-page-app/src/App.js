import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function App() {
  const { state, signIn, signOut } = useAuthContext();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/books")
      .then((response) => response.json())
      .then((data) => setBooks(data));
  }, []);

  return (
    <div >
      {state.isAuthenticated ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ul>
            <li>{state.username}</li>
          </ul>

          <button
            style={{ backgroundColor: "blue", color: "white" }}
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={() => signIn()}
        >
          Login
        </button>
      )}

      <div>
        <h2 style={{ textAlign: "center" }}>Books</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <div>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Status: {book.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;