// Define the variables needed for the Edamam Recipe API and for the Edamam Ingredients API requests as well as their API keys.
var recipeAppId = "1f6d88b8";
var recipeAppKey = "7537eeca1e7b8144211802174e66b65a";
var ingredientAppId = "92abae99";
var ingredientAppKey = "3b826e041a1b3986fff646d47026e872";



// Define global variables
var ingredient = "";
var mealType = "";
var cuisineType = "";
var consultedRecipes = [];

// Define variables to traverse the DOM
var previousSearchUl = document.getElementById("previousSearchUl");

// List functions to execute: 

init ();                    // Call function that loads previous searches  


// Functions: 

// init () - Code for function that will load initial data and previous searches

function init () {

    var previousSearches = JSON.parse(localStorage.getItem("consultedRecipes"));

    if (previousSearches !== null) {

        consultedRecipes = previousSearches;
        previousSearches.sort(); // Sort searches alphabetically
    }

    renderPrevSearches(); // Call function to create content related to previous searches stored in local storage
}

// localStorePreviousSearches() - Code for funtion that will store input data inside the cities array into the local storage

function localStorePreviousSearches() {

    localStorage.setItem("consultedRecipes", JSON.stringify(consultedRecipes));
}

// renderPrevSearches() - Code for function that will create li elements showing previous searches in the html main modal

function renderPrevSearches() {

    previousSearchUl.innerHTML = "";

    if (consultedRecipes == null) {

    return;

    } else {

    var newRecipes = [...new Set(consultedRecipes)]; // Create a variable to store recipes without duplicates by using the spread operator and set
    for (var i = 0; i < newRecipes.length; i++) {

        var recipeLi = document.createElement("li");                            // Create a new li element
        recipeLi.className = "previousSearchLi";                                // Set the class for the li element
        var liInnerDiv = document.createElement("div");                         // Create a new div element
        liInnerDiv.className = "custom-column column is-narrow box ml-1 mr-1";  // Set the classes for the div element
        var recipeName = newRecipes[i];                                         // Create a new text node with the recipe name
        liInnerDiv.textContent = recipeName;
        recipeLi.appendChild(liInnerDiv);                                       // Append the div element to the li element
        previousSearchUl.appendChild(recipeLi);                                 // Append the li element to the ul element
    }

    // Attach event listener to ".previousSearchLi" elements after they have been created

    var storedRecipes = document.querySelectorAll(".previousSearchLi");

    storedRecipes.forEach(function(storedRecipe) {

        storedRecipe.addEventListener("click", function(event) {

        event.preventDefault();
        queryRecipeName = this.textContent;       // this is the value that will be used for the api call
        getStoredRecipes(queryRecipeName);        // Call the function to get the recipes based on local storage data
        });
    });
    }
}

// getStoredRecipes(queryRecipeName) - Code for function that will fetch the recipe name stored in local storage

function getStoredRecipes(queryRecipeName) {
    var recipeUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${recipeAppId}&app_key=${recipeAppKey}&q=${queryRecipeName}`;
    var ingredientUrl = `https://api.edamam.com/api/food-database/v2/parser?app_id=${ingredientAppI}d&app_key=${ingredientAppKey}&ingr=${ingredient}`;

    fetch(recipeUrl)
    
        .then(function(response){
            return response.json();
        })

        .then(function(data) {

            var recipes = [];
            if (data.hits) {
                recipes = data.hits;
            }

            for (var i = 0; i < recipes.length; i++ ) {

                var recipe = recipes[i].recipe;
                console.log("Recipe Name: ", recipe.label);
                console.log("Recipe URL: ", recipe.url);
                console.log("Recipe Image: ", recipe.image);
                console.log("Recipe Ingredients: ", recipe.ingredientLines.slice(0, 5));

            }



        })








}


// Event Listeners:

