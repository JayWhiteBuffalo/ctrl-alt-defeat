import { useEffect, useState } from 'react';

export default function FavoriteRecipesComponent({ handleRecipe }) {
  const [recipeList, setRecipeList] = useState(null);

  useEffect(() => {
    function fetchData() {
      fetch('http://localhost:8080/add-recipe/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network resonse was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setRecipeList(data);
        })
        .catch((error) => {
          console.error('There was a problem fetching the data: ', error);
        });
    }

    fetchData();
  }, []);

  return (
    <div className="favoriteRecipes">
      <h2>Favorite Recipes</h2>
      {recipeList && recipeList.length > 0 ? (
        <ul>
          {recipeList.map((recipe, index) => (
            <a>
              <li key={index}>
                <span onClick={() => handleRecipe(recipe)}>{recipe.name}</span>
              </li>
            </a>
          ))}
        </ul>
      ) : (
        <p>No favorite recipes found</p>
      )}
    </div>
  );
}
