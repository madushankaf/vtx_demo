import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";


function App() {
  const { state, signIn, signOut, getIDToken, getAccessToken } = useAuthContext();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    status: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (state.isAuthenticated) {
        const token = await getAccessToken();
        
        fetch("https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/books-api/books-rest-endpoint-d70/v1/books", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => response.json())
          .then((data) => setBooks(data));
      }
    };

    fetchData();
  }, [state.isAuthenticated]);

  const addBook = async () => {
    const token = await getAccessToken();
    fetch("https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/books-api/books-rest-endpoint-d70/v1/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newBook)
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks([...books, ...data]);
        } else {
          setBooks([...books, data]);
        }
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
          {Object.values(books).map((book) => (
            <li key={book.uuid}>
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