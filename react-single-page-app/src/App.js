import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function App() {
  const { state, signIn, signOut, getIDToken, getAccessToken, getBasicUserInfo } = useAuthContext();
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    status: "read",
    uuid: ""
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState(""); // State variable for username
  const [showPopup, setShowPopup] = useState(false); // State variable for modal visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchBooks, setSearchBooks] = useState([]);

  const fetchBooks = async (query) => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(`https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/search-service/books-031/v1?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        try {
          fetchRating(data[i].title).then((rating) => {
            console.log(rating);
            data[i].rating = rating;
          });
        } catch (error) {
          console.error("Error fetching rating:", error);
        }
      }
      setSearchBooks(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRating = async (bookName) => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(`https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/rating-service/endpoint-8090-8b1/v1/rating?book=${bookName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rating');
      }
      const data = await response.json();
      setSearchBooks(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchData = async () => {
    if (state.isAuthenticated) {
      const token = await getAccessToken();

      fetch("https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/books-api/books-rest-endpoint-d70/v1/books", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setBooks(data); // Update books state with fetched data
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          // Handle error appropriately
        });
    }
  };


  useEffect(() => {

    if (state.isAuthenticated) {
      getBasicUserInfo().then((basicUserDetails) => {
        console.log(basicUserDetails);
        setUsername(basicUserDetails.email);

      }).catch((error) => {
      })
    }
    fetchData();
  }, [state.isAuthenticated]);



  // Inside addBook function
  const addBook = async () => {
    const token = await getAccessToken();

    fetch("https://47d151e6-e041-4ec4-a2a9-549f8a542a7a-dev.e1-us-east-azure.choreoapis.dev/dyzg/books-api/books-rest-endpoint-d70/v1/books", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newBook)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data received from the server
        // Check if data contains required fields (uuid, title, author)
        if (data.uuid && data.title && data.author) {
          // If data contains required fields, create a book object with optional status
          // const newBookData = {
          //   uuid: data.uuid,
          //   title: data.title,
          //   author: data.author,
          //   status: data.status || "" // Use empty string if status is not provided
          // };

          // // Update the books state with the new book data
          // setBooks(...books, data);

          // // Reset the newBook state
          // setNewBook({
          //   title: "",
          //   author: "",
          //   status: "",
          //   uuid: ""
          // });
          fetchData();
        } else {
          // Handle the case when required fields are missing
          console.error("Missing required fields in the response:", data);
          setErrorMessage(`${data.error_message} : ${data.error_description}`); // Set error message
          setShowPopup(true);
          // You may want to display an error message to the user or handle this case differently
        }
      })
      .catch((error) => {
        console.error("Error adding book:", error);
        setErrorMessage(`Error adding book: ${error}`); // Set error message
        setShowPopup(true);
      });
  };

  const handleClosePopup = () => setShowPopup(false);



  return (
    <div>

      {state.isAuthenticated ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <h3 style={{ marginRight: "10px", color: "blue" }}>Welcome, {username}</h3>
          <button
            style={{
              backgroundColor: "lightblue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              marginTop: "10px",
              marginLeft: "10px"
            }}
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          style={{
            backgroundColor: "lightblue",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            marginTop: "10px",
            marginLeft: "10px"
          }}
          onClick={() => signIn()}
        >
          Login
        </button>
      )}

      <div>
        {state.isAuthenticated && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginTop: "20px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  handleSearchInputChange(e);
                  if (e.target.value === "") {
                    setSearchBooks([]); // Clear the searchBooks array when the search text is blank
                  } else {
                    fetchBooks(); // Call fetchBooks function when the text changes
                  }
                }}
                placeholder="Search books..."
                style={{
                  padding: "5px",
                  marginBottom: "10px",
                  width: "300px",
                  borderRadius: "5px",
                  border: "1px solid gray"
                }}
              />
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {searchBooks.length > 0 && (
                <pre contentEditable={true} style={{ backgroundColor: "lightgray", padding: "10px", borderRadius: "5px" }}>
                  <ul style={{ listStyleType: "none", padding: "0" }}>
                    {searchBooks.map((book) => (
                      <li
                        key={book.id}
                        style={{ marginBottom: "5px", cursor: "pointer" }}
                        onClick={() => setNewBook({ ...newBook, title: book.title , author: book.author})}
                      >
                        {book.title}
                      </li>
                    ))}
                  </ul>
                </pre>
              )}
            </div>
            <div style={{ marginBottom: "10px", display: "flex" }}>
              <div style={{ marginRight: "10px" }}>

                <input
                  type="text"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  style={{ padding: "5px" }}
                />
              </div>
              <div style={{ marginRight: "10px" }}>
                <input
                  type="text"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  style={{ padding: "5px" }}
                />
              </div>
              {/* <div>
                <input
                  type="text"
                  placeholder="Status"
                  value={newBook.status}
                  onChange={(e) =>
                    setNewBook({ ...newBook, status: e.target.value })
                  }
                  style={{ padding: "5px" }}
                />
              </div> */}
            </div>
            <Modal
              show={showPopup}
              onHide={handleClosePopup}
              centered // Add this style to center the modal
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Error Adding Book</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{errorMessage}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={handleClosePopup}
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <button
              onClick={addBook}
              style={{
                backgroundColor: "blue",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add a new Book
            </button>
          </div>
        )}
        <h2 style={{ color: "blue", textAlign: "center" }}>Available Books</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px"
          }}
        >
          {Object.values(books).map((book) => (
            <div
              key={book.uuid}
              style={{
                border: "1px solid black",
                padding: "10px",
                backgroundColor: "lightblue"
              }}
            >
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
                <p style={{ color: "green" }}>Rating: {book.rating} / 10</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default App;