import React, { useState } from 'react';
import config from '../../config';

export default function SearchFormComponent({
  setSearchResults,
  setLoadingSearch,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const apiKey = config.API_KEY;
  const maxResults = 6;

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoadingSearch(true);
      const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${encodeURIComponent(
        searchTerm
      )}&number=${maxResults}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="recipeSearch">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for a recipe here"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
