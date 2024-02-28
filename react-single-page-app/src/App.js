import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function App() {
  const { state, signIn, signOut } = useAuthContext();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    status: ""
  });

  useEffect(() => {
    fetch("/books")
      .then((response) => response.json())
      .then((data) => setBooks(data));
  }, []);

  const addBook = () => {
    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newBook)
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks([...books, data]);
        setNewBook({
          title: "",
          author: "",
          status: ""
        });
      });
  };

  return (
    <div>
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

      {state.isAuthenticated && (
        <div>
          <h2>Add a Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) =>
              setNewBook({ ...newBook, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) =>
              setNewBook({ ...newBook, author: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Status"
            value={newBook.status}
            onChange={(e) =>
              setNewBook({ ...newBook, status: e.target.value })
            }
          />
          <button onClick={addBook}>Add Book</button>
        </div>
      )}
    </div>
  );
}

export default App;