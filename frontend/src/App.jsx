import { useState, useEffect } from 'react';
import './App.css';
import SearchFormComponent from './components/SearchFormComponent';
import DisplayResultsComponent from './components/DisplayResultsComponent';
import CurrentRecipeComponent from './components/CurrentRecipeComponent';
import FavoriteRecipesComponent from './components/FavoriteRecipesComponent';
import AddYourOwnRecipeComponent from './components/AddYourOwnRecipeComponent';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);
  const [update, setUpdate] = useState(0);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleRecipe = (recipe) => {
    setRecipe(recipe);
  };

  const handleShowAddRecipeForm = (bool) => {
    setShowAddRecipeForm(bool);
  };

  const handleUpdate = (number) => {
    setUpdate(number);
  }

  useEffect(() => {
    fetch('http://localhost:8080/get-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((userData) => {
        setCurrentUser(userData);
        console.log(currentUser);
      })
      .catch((error) => {
        console.error('There was a problem fetching the current user:', error);
      });
  }, []);

  return (
    <>
      <div id="recipe-search-component">
        <SearchFormComponent setSearchResults={handleSearchResults} />
      </div>

      <div className="mainBody">
        <DisplayResultsComponent
          id="display-results-component"
          searchResults={searchResults}
          setRecipe={handleRecipe}
          setShowAddRecipeForm={handleShowAddRecipeForm}
        />

        <CurrentRecipeComponent
          id="current-recipe-component"
          recipe={recipe}
          showAddRecipeForm={showAddRecipeForm}
          setRecipe={handleRecipe}
          setShowAddRecipeForm={handleShowAddRecipeForm}
          setUpdate={handleUpdate}
        />

        <div className="rightsideBody">
          <FavoriteRecipesComponent
            id="favorite-recipes-component"
            setRecipe={handleRecipe}
            setShowAddRecipeForm={handleShowAddRecipeForm}
            recipe={recipe}
            showAddRecipeForm={showAddRecipeForm}
            update={update}
          />

          <AddYourOwnRecipeComponent
            id="add-your-own-recipe-component"
            setShowAddRecipeForm={handleShowAddRecipeForm}
          />
        </div>
      </div>
    </>
  );
}

export default App;
