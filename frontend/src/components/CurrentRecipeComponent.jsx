import { useState, useEffect } from 'react';
import PrintButton from './PrintButtonComponent';

export default function CurrentRecipeComponent({
  recipe,
  showAddRecipeForm,
  setRecipe,
  setUpdate,
  loadingRecipe,
  updateStatus,
}) {
  const [displayedRecipe, setDisplayedRecipe] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [ingredientName, setIngredientName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [addrecipe, setAddrecipe] = useState({
    name: '',
    description: '',
    ingredients: [],
    image: null,
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    ingredients: [],
    image: null,
  });
  const [comment, setComment] = useState({
    text: '',
    recipeId: '',
    username: '',
  });
  const [comments, setComments] = useState([]);

  //Shopping Cart List for adding Ingredients
  const handleAddToShoppingList = (ingredient) => {
    if (!shoppingList.includes(ingredient)) {
      setShoppingList([...shoppingList, ingredient]);
      setShoppingListCount((prevCount) => prevCount + 1);
      console.log(shoppingList);
    } else {
      let index = shoppingList.indexOf(ingredient);
      let newShoppingList = shoppingList.filter(
        (ingredient) => shoppingList.indexOf(ingredient) !== index
      );
      setShoppingListCount((prevCount) => prevCount - 1);
      setShoppingList(newShoppingList);
      console.log(shoppingList);
    }
  };

  const handleOpenShoppingList = () => {
    const shoppingListWindow = window.open('', '_blank');
    if (shoppingListWindow) {
      shoppingListWindow.document.write(
        '<html><head><title>Shopping List</title></head><body>'
      );

      shoppingListWindow.document.write('<h2>Shopping List</h2>');

      // Render shopping list content in the new window
      shoppingList.forEach((ingredient) => {
        shoppingListWindow.document.write(`<p>${ingredient}</p>`);
      });

      shoppingListWindow.document.write(
        '<button onclick = "window.print()">Print</button>'
      );

      shoppingListWindow.document.write('</body></html>');
      shoppingListWindow.document.close();
    }
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  const addIngredient = () => {
    setAddrecipe({
      ...addrecipe,
      ingredients: [
        ...addrecipe.ingredients,
        { originalName: originalName, name: ingredientName },
      ],
    });

    // Clear the input fields after adding an ingredient
    setIngredientName('');
    setOriginalName('');
    setErrors({ ...errors, ingredients: '' });
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setName(value);
      setAddrecipe({ ...addrecipe, [name]: value });
    } else if (name === 'description') {
      setDescription(value);
      setAddrecipe({ ...addrecipe, [name]: value });
    } else if (name === 'original-name') {
      setOriginalName(value);
    } else if (name === 'ingredient-name') {
      setIngredientName(value);
    }
    // Clear the associated error when the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAddrecipe({ ...addrecipe, image: reader.result });
          setErrors({ ...errors, image: null });
          console.log(addrecipe.image.length);
        } else {
          // Handle the case where the file couldn't be read
          setErrors({ ...errors, image: 'Error reading the selected file' });
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case where no file is selected
      setAddrecipe({ ...addrecipe, image: null }); // Set image to null or some default value
      setErrors({ ...errors, image: 'Please select an image' });
    }
  };

  const onSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    //Basic client side validations
    let newErrors = {};

    if (!name.trim()) {
      newErrors = { ...newErrors, name: 'Please enter recipe title.' };
    }
    if (!description.trim()) {
      newErrors = {
        ...newErrors,
        description: 'Please enter recipe description.',
      };
    }
    if (addrecipe.ingredients.length === 0) {
      newErrors = {
        ...newErrors,
        ingredients: 'Please enter recipe ingredients.',
      };
    }
    if (!addrecipe.image) {

      newErrors = { ...newErrors, image: 'Please upload recipe image.' };
    }
    // If there are errors, update the state and stop the submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const recipeToAdd = {
      ...addrecipe,
      userCreated: true,
    };

    try {
      console.log(
        `Inside the update/add request: ${JSON.stringify(recipeToAdd)}`
      );
      const response = await fetch(
        `http://localhost:8080/recipe/${updateStatus ? 'update' : 'add'}`,
        {
          method: `${updateStatus ? 'PUT' : 'POST'}`,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeToAdd),
        }
      );
      if (!response.ok) {
        console.error(
          `Failed to ${updateStatus ? 'update' : 'add'} recipe. Status: ${
            response.status
          }`
        );
        return;
      }
      console.log(response);

      // Set success message after a successful request
      setSuccessMessage(
        `Recipe ${updateStatus ? 'updated' : 'added'} successfully!!`
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);

      // Change update state to re-render favorites recipe list
      setUpdate(1);
      // Reset the form fields to an empty state
      setAddrecipe({
        name: '',
        description: '',
        ingredients: [],
        image: null,
              });

     } catch (error) {
      console.error('Error during form submission:', error);
    }

  };

  const handleAddFavoritesClick = (recipeData) => {
    console.log(recipeData);

    const recipeToAdd = {
      ...recipeData,
      userCreated: false,
    };
    console.log(recipeToAdd);

    fetch('http://localhost:8080/recipe/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeToAdd),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setRecipe(data);
      })
      .catch((error) => {
        console.error('Error adding the recipe: ', error);
      });
  };

  useEffect(() => {
    console.log('Recipe in useEffect', recipe);
    // if (recipe?.title && recipe?.image) {
    if ((recipe?.name || recipe?.title) && recipe?.image) {
      const {
        name,
        title,
        image,
        extendedIngredients,
        ingredients,
        plainTextInstructions,
        description,
      } = recipe;

      // Choose the appropriate property based on availability
      const recipeName = name || title;
      const actualIngredients = extendedIngredients || ingredients;
      const actualDescription = plainTextInstructions || description;

      // Shortens instructions to fit screen/not throw an error saving to database
      const truncatedDescription = actualDescription.slice(0, 900);

      // Build out displayedRecipe object to update displayed content
      const updatedDisplayedRecipe = {
        name: recipeName,
        description: truncatedDescription,
        image: image,
        ingredients: actualIngredients.map((ingredient) => ({
          originalName: ingredient.original || ingredient.originalName,
          name: ingredient.name,
        })),
      };

      console.log('Updated displayed recipe:', updatedDisplayedRecipe);
      setDisplayedRecipe(updatedDisplayedRecipe);
    }
  }, [recipe]);

  useEffect(() => {
    // Fetch comments when the recipe changes
    const fetchComments = async () => {
      if (recipe?.id) {
        try {
          const response = await fetch(
            `http://localhost:8080/comment/recipe/${recipe.id}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setComments(data); // Update the state with fetched comments
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
  }, [recipe]);

  const submitComment = async (e) => {
    e.preventDefault();

    const { text } = comment;

    try {
      const response = await fetch('http://localhost:8080/comment/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          recipeId: recipe.id, // Include the recipeId in the comment
          username: comment.username,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming the response contains the newly added comment
      const newComment = await response.json();

      // Fetch comments again after submitting a new comment
      setComments([...comments, newComment]);

      // Reset the form fields to an empty state
      setComment({
        text: '',
        recipeId: '',
        username: '',
      });
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  console.log(
    `showAddRecipeForm:${showAddRecipeForm}\nupdateStatus:${updateStatus}\nloadingRecipe:${loadingRecipe}`
  );

  if (loadingRecipe) {
    return (
      <div className="currentRecipe">
        <div className="spinnerContainer">
          <div className="spinner"></div>
        </div>
      </div>
    );
  } else if (updateStatus) {
    return (
      <div className="currentRecipe">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <h1>Update Your Recipe!!!</h1>
        <form onSubmit={(e) => onSubmit(e)} className="form-group">
          <div>
            <label htmlFor="recipe-name"> Title : </label>
            <input
              type="text"
              id="recipe-name"
              name="name"
              placeholder="Your recipe's title"
              onChange={(e) => onInputChange(e)}
              value={name}
            />
            <div className="error-message">{errors.name}</div>
          </div>
          <br></br>
          <div>
            <label htmlFor="recipe-description"> Description : </label>
            <textarea
              type="text"
              id="recipe-description"
              name="description"
              placeholder="Your recipe's instructions"
              onChange={(e) => onInputChange(e)}
              value={description}
            />
            <div className="error-message">{errors.description}</div>
          </div>
          <br></br>
          <div className="ingredients-input">
            <label htmlFor="recipe-ingredients"> Ingredients : </label>
            {addrecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="input-container">
                <input
                  type="text"
                  className="ingredient"
                  placeholder="Ingredient"
                  value={ingredient}
                  disabled
                />
              </div>
            ))}
            <div className="input-container">
              <input
                type="text"
                className="ingredient"
                id="recipe-ingredient-name"
                name="ingredient-name"
                placeholder="Ingredient Name"
                onChange={(e) => setIngredient(e.target.value)}
                value={ingredient}
              />
              <button type="button" onClick={addIngredient}>
                Add
              </button>
            </div>
          </div>
          <div className="error-message">{errors.ingredients}</div>
          <br></br>
          <div className="image-div">
            <label htmlFor="recipe-image"> Upload Image : </label>
            <input
              type="file"
              id="recipe-image"
              name="image"
              onChange={(e) => onFileChange(e)}
            />
            <div className="error-message">{errors.image}</div>
          </div>
          <br></br>
          <div className="button-container">
            <button type="submit">Update Recipe</button>
          </div>
        </form>
      </div>
    );
  } else if (showAddRecipeForm) {
    return (
      <div className="currentRecipe">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <h1>Add Your Own Recipe!!!</h1>
        <form onSubmit={(e) => onSubmit(e)} className="form-group">
          <div>
            <label htmlFor="recipe-name"> Title : </label>
            <input
              type="text"
              id="recipe-name"
              name="name"
              placeholder="Your recipe's title"
              onChange={(e) => onInputChange(e)}
              value={name}
            />
            <div className="error-message">{errors.name}</div>
          </div>
          <br></br>
          <div>
            <label htmlFor="recipe-description"> Description : </label>
            <textarea
              type="text"
              id="recipe-description"
              name="description"
              placeholder="Your recipe's instructions"
              onChange={(e) => onInputChange(e)}
              value={description}
            />
            <div className="error-message">{errors.description}</div>
          </div>
          <br></br>
          <div className="ingredients-input">
            <label htmlFor="recipe-ingredients"> Ingredients : </label>
            {addrecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="input-container">
                <input
                  type="text"
                  className="ingredient-quantity"
                  placeholder="Ingredient Quantity"
                  value={ingredient.originalName}
                  disabled
                />
                <input
                  type="text"
                  className="ingredient-name"
                  placeholder="Ingredient Name"
                  value={ingredient.name}
                  disabled
                />
              </div>
            ))}
            <p>Example: 1 cup of carrots ----------------- carrots</p>
            <div className="input-container">
              <input
                className="ingredient-original"
                type="text"
                id="recipe-ingredient-original"
                name="original-name"
                placeholder="Full Description"
                onChange={(e) => setOriginalName(e.target.value)}
                value={originalName}
              />
              <input
                className="ingredient-name"
                type="text"
                id="recipe-ingredient-name"
                name="ingredient-name"
                placeholder="Ingredient Name"
                onChange={(e) => setIngredientName(e.target.value)}
                value={ingredientName}
              />
              <button type="button" onClick={addIngredient}>
                Add
              </button>
            </div>
          </div>
          <div className="error-message">{errors.ingredients}</div>
          <br></br>
          <div className="image-div">
            <label htmlFor="recipe-image"> Upload Image : </label>
            <input
              type="file"
              id="recipe-image"
              name="image"
              onChange={(e) => onFileChange(e)}
            />
            <div className="error-message">{errors.image}</div>
          </div>
          <br></br>
          <div className="button-container">
            <button type="submit">Add Recipe</button>
          </div>
        </form>
      </div>
    );
  } else if (!displayedRecipe) {
    return (
      <>
        <div className="currentRecipe">
          <p>Select a recipe to see it here</p>
        </div>
      </>
    );
  } else {
    const { name, description, ingredients, image } = displayedRecipe;
    // Split the description at periods not preceded by a number
    const segments = description.split(/(?<!\d)\.\s*/);

    return (
      <div className="currentRecipe">
        <div className="current-title-favorite">
          <p>
            <button
              className="favorite-btn"
              onClick={() => handleAddFavoritesClick(displayedRecipe)}
            >
              <span className="star"></span> Add to Favorites
            </button>
            <button
              className="shopping-btn"
              onClick={() => {
                handleOpenShoppingList();
              }}
            >
              Shopping List ({shoppingListCount})
            </button>
          </p>
        </div>
        <div>
          <div className="current-image-div">
            <img src={image} alt={name} className="current-image" />
          </div>
          <div id="recipeToPrint">
            <h2>{name}</h2>
            <h3>Ingredients:</h3>
            <p className="shoppingListP">(Check to add to shopping list)</p>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  <div className="ingredientList">
                    <input
                      type="checkbox"
                      id={`ingredientCheckbox${index}`}
                      onChange={() => {
                        handleAddToShoppingList(ingredient.name);
                        console.log(ingredients);
                      }}
                    />
                    <label htmlFor="{`ingredientCheckbox${index}`}">
                      {ingredient.originalName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <br></br>
            <h3>Directions:</h3>
            <p>
              <p>
                {segments.map((segment, index) => (
                  <span key={index}>
                    {segment}
                    <br />
                  </span>
                ))}
              </p>
            </p>
          </div>
          <PrintButton currentRecipeId="recipeToPrint" />
        </div>

        <div className="commentSection">
          <textarea
            name="text"
            placeholder="Add your comments here..."
            value={comment.text}
            onChange={(e) =>
              setComment({
                text: e.target.value,
                recipeId: comment.recipeId, // Preserve the recipeId
                username: comment.username, // Preserve the username
              })
            }
          />
          <button
            onClick={() => {
              submitComment();
              setUpdate(1);
            }}
          >
            Post Comment
          </button>
          {comments
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <div key={comment.id} className="comment">
                <small>
                  {comment.username} -{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
                <p>{comment.text}</p>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
