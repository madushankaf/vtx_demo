import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthContext();

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchBooks(searchQuery);
    } else {
      // Clear books when search query is empty
      setBooks([]);
    }
  }, [searchQuery]);

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
      setBooks(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search books..."
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {books.length > 0 && (
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
