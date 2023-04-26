// Define the variables needed for the Edamam Recipe API and for the Spoonacular API requests as well as their API keys.
var recipeAppId = "1f6d88b8";
var recipeAppKey = "7537eeca1e7b8144211802174e66b65a";
// var ingredientAppId = "92abae99";
// var ingredientAppKey = "3b826e041a1b3986fff646d47026e872";
var ingredientAppKey = "wv9E70dYQH5mLzitSnPYJbrYoM3dD3gq9d6CbewC";  // AppKey for USDA

// Define global variables
var ingredient = "";
var mealType = "";
var cuisineType = "";
var consultedRecipes = [];
var mainIngredient = "";  // variable used to store the mainIngredient fetched from the recipe search ingredients array

//TEST VAR DELETE
// var queryRecipeName = "Pan-Browned Brussel Sprouts"
// //localStorage.setItem("consultedRecipes", "Pan-Browned Brussel Sprouts"); 
// consultedRecipes.push("Pan-Browned Brussel Sprouts");
// localStorage.setItem("consultedRecipes", JSON.stringify(consultedRecipes));
// mainIngredient = "brussel sprout"
// ingredient = "chicken";
// mealType = "lunch";
// cuisineType = "mexican";



// Define variables to traverse the DOM
var mainModal = document.getElementById("mainModal");
var loadingModal = document.getElementById("loadingModal");
var recipeListModal = document.getElementById("recipeListModal");
var previousSearchUl = document.getElementById("previousSearchUl");
var recipeDiv = document.getElementById("recipeDiv");
var recipeImageDiv = document.getElementById("recipeImageDiv");
var recipeNameDiv = document.getElementById("recipeNameDiv");
var recipeIngredientsDiv = document.getElementById("recipeIngredientsDiv");
var recipeLinkDiv = document.getElementById("recipeLinkDiv");
var recipeFactsDiv = document.getElementById("recipeFactsDiv");
var recipeListUl = document.getElementById("recipeListUl");
var ingredientSelect = document.getElementById("ingredientSelect");
var cuisineSelect = document.getElementById("cuisineSelect");
var mealSelect = document.getElementById("mealSelect");
var querySubmit = document.getElementById("querySubmit");
var warningModal = document.getElementById("warningModal");
var recipeListCancelBtn = document.getElementById("recipeListCancelBtn");
var backBtn = document.getElementById("backBtn");
var backtoMainBtn = document.getElementById("backtoMainBtn");
var clearLocalStorage = document.getElementById("clearLocalStorage");


// List functions to execute: 

init ();                    // Call function that loads previous searches  




// Functions: 

// localStorePreviousSearches() - Code for funtion that will store input data inside the cities array into the local storage

function localStorePreviousSearches() {

    localStorage.setItem("consultedRecipes", JSON.stringify(consultedRecipes));
}


// init () - Code for function that will load initial data and previous searches

function init () {

   // mainModal.classList.add("is-active");
    var previousSearches = JSON.parse(localStorage.getItem("consultedRecipes"));

    if (previousSearches !== null) {

        consultedRecipes = previousSearches;
        previousSearches.sort(); // Sort searches alphabetically
    }

    
    clearRecipeData();      // Call function to delete content related to recipe data in the html 
    renderPrevSearches();   // Call function to create content related to previous searches stored in local storage
}


// clearRecipeData() - Code for function to clear innerHTML contents for divs containing recipe data in the html file

function clearRecipeData() {

    recipeImageDiv.innerHTML = "";
    recipeNameDiv.innerHTML = "";
    recipeIngredientsDiv.innerHTML = "";
    recipeLinkDiv.innerHTML = "";
    recipeFactsDiv.innerHTML = "";
}

// renderPrevSearches() - Code for function that will create li elements showing previous searches in the html main modal

function renderPrevSearches() {

    previousSearchUl.innerHTML = ""; // Clear contents for the previous Search list

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
        mainModal.classList.remove("is-active");  // Switch from main modal to loading page
        loadingModal.classList.add("is-active");  // Activate loading modal page

        // Set a timeout of 6 seconds (6000 milliseconds)
        setTimeout(function() {
            loadingModal.classList.remove("is-active");  // Remove is-active class from loadingModal
        }, 6000);
        });
    });
    }
}

// getStoredRecipes(queryRecipeName) - Code for function that will fetch the recipe name stored in local storage

function getStoredRecipes(queryRecipeName) {

    // // Construct the Recipe Search API endpoint using the queryRecipeName value
    var recipeUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${recipeAppId}&app_key=${recipeAppKey}&q=${queryRecipeName}`;
    
    // // Fetch data from the Edamam Recipe Search API

    fetch(recipeUrl)
    
        .then(function(response){
            return response.json();
        })

        .then(function(data) {

            var recipes = [];
            if (data.hits) {
                recipes = data.hits;
            }
            
            var recipe = recipes[0].recipe;
            console.log("Recipe Name: ", recipe.label);
            var recipeLabel = recipe.label
            console.log("Recipe URL: ", recipe.url);
            var recipeLink = recipe.url;
            console.log("Recipe Image: ", recipe.image);
            var recipeImage = recipe.image;
            console.log("Recipe Ingredients: ", recipe.ingredientLines.slice(0, 5));
            var recipeIngredients = recipe.ingredientLines.slice(0, 5);
            console.log("Recipe Main Ingredient: ", recipe.ingredients[0].food);
            mainIngredient = recipe.ingredients[0].food;
            console.log ("mainIngredient variable is:" + mainIngredient);

            // Add contents to the html page

            recipeImageDiv.innerHTML = `
            <img src="${recipeImage}">
            `;

            recipeNameDiv.innerHTML = `
            <p class="title is-size-2 has-text-centered has-text-white p-2">${recipeLabel}</p>
            `;

            recipeIngredientsDiv.innerHTML = `
            <p class="title is-size-4  has-text-white has-text-centered">Main Ingredients</p>
            <p class="custom-p subtitle m-1 has-text-centered">
                <br>
                ${recipeIngredients}                    
            </p>
            `;

            recipeLinkDiv.innerHTML = `
            <p class="title is-size-3 has-text-white  p-2">Preparation Instructions</p>
            <button class="button is-white" onclick="window.open('${recipeLink}', '_blank')">Get Recipe</button>
            `;
        })
        
    // Construct the endpoint using the mainIngredient value. This endpoint will fetch the ingredient's nutritional facts from USDA. 
    var ingredientUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${mainIngredient}&api_key=${ingredientAppKey}`;
    

    // Fetch data from the USDA API

    fetch(ingredientUrl)

        .then(function(response) {

            return response.json();
        })

        .then(data => {
            if (data.foods && data.foods.length > 0) {
                // Extract nutrient information from the API response
                var food = data.foods[0];
                var nutrients = food.foodNutrients;
                
                // Access nutrient values as needed
                var calories = nutrients.find(nutrient => nutrient.nutrientId === 1008)?.value || 0;
                var protein = nutrients.find(nutrient => nutrient.nutrientId === 1003)?.value || 0;
                var fat = nutrients.find(nutrient => nutrient.nutrientId === 1004)?.value || 0;
                var carbohydrates = nutrients.find(nutrient => nutrient.nutrientId === 1005)?.value || 0;
                var fiber = nutrients.find(nutrient => nutrient.nutrientId === 1079)?.value || 0;
                
                // Use the nutrient values in your code as needed
                console.log('Calories: ', calories);
                var ingredientCalories = calories;
                console.log('Protein: ', protein);
                var ingredientProtein = protein;
                console.log('Fat: ', fat);
                var ingredientFat = fat;
                console.log('Carbohydrates: ', carbohydrates);
                var ingredientCarbs = carbohydrates;
                console.log('Fiber: ', fiber);
                var ingredientFiber = fiber;
            } else {
                console.log('No nutrient data available for the given ingredient');
            }

            // Add contents to the html page

            recipeFactsDiv.innerHTML = `
            <p class="title is-size-4  has-text-white has-text-centered">Nutritional Facts</p>
            <br>
            <p class="custom-p subtitle m-1 has-text-centered">
                Proteins: ${ingredientProtein}g    
            </p>
            <p class="custom-p subtitle m-1 has-text-centered">
                Fat: ${ingredientFat}g    
            </p>
            <p class="custom-p subtitle m-1 has-text-centered">
                Carbs: ${ingredientCarbs}g    
            </p>
            <p class="custom-p subtitle m-1 has-text-centered">
                Calories: ${ingredientCalories}g    
            </p>
            <p class="custom-p subtitle m-1 has-text-centered">
                Fiber: ${ingredientFiber}g    
            </p>
            `;
        })
}


// getRecipesList() - Code for function that will fetch a recipes list based on user input

function getRecipesList() {

    
    recipeListUl.innerHTML = ""; // Clear contents for the previous Search list


    // // Construct the Recipe Search API endpoint using the values input by the user value
    var recipeUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${recipeAppId}&app_key=${recipeAppKey}&q=${ingredient}&mealType=${mealType}&cuisineType=${cuisineType}`;
    
    // // Fetch data from the Edamam Recipe Search API

    fetch(recipeUrl)
    
        .then(function(response){
            return response.json();
        })

        .then(function(data) {

            var recipes = [];
            if (data.hits) {
                recipes = data.hits;
            }

            
            for (var i = 0; i < 10; i++) {
                var recipe = recipes[i].recipe;
                console.log("Recipe Name: ", recipe.label);
                var recipeName = recipe.label;
                // Add contents to the html page
                var recipeLi = document.createElement("li");                            // Create a new li element
                recipeLi.className = "recipeListLi";                                // Set the class for the li element
                var liInnerDiv = document.createElement("div");                         // Create a new div element
                liInnerDiv.className = "custom-column column is-narrow box mt-1 mb-1";  // Set the classes for the div element
                liInnerDiv.textContent = recipeName;
                recipeLi.appendChild(liInnerDiv);                                       // Append the div element to the li element
                recipeListUl.appendChild(recipeLi);                                 // Append the li element to the ul element
            }

            // Attach event listener to ".recipeListLi" elements after they have been created

            var listedRecipes = document.querySelectorAll(".recipeListLi");

            listedRecipes.forEach(function(listedRecipe) {

                listedRecipe.addEventListener("click", function(event) {

                event.preventDefault();
                queryRecipeName = this.textContent;       // this is the value that will be used for the api call
                
                consultedRecipes.push(queryRecipeName);
                localStorePreviousSearches();             // Call the function to store selected recipe to the local storage
                
                getStoredRecipes(queryRecipeName);        // Call the function to get the recipes based on user selection
                recipeListModal.classList.remove("is-active");  // Switch from recipe list modal to loading modal
                loadingModal.classList.add("is-active");        // Activate loading modal
                
                // Set a timeout of 6 seconds (6000 milliseconds)
                setTimeout(function() {
                loadingModal.classList.remove("is-active");  // Remove is-active class from loadingModal sending the user to the html page
                }, 6000);

                });
            });
        })
}


// Event Listeners:

// Ingredient Dropdown List Event Listener

ingredientSelect.addEventListener("change", function(event) {

    ingredient = event.target.value;
    console.log(ingredient);
});

// Cuisine Dropdown List Event Listener
cuisineSelect.addEventListener("change", function(event) {

    cuisineType = event.target.value;
});

// Meal Dropdown List Event Listener
mealSelect.addEventListener("change", function(event) {

    mealType = event.target.value;
});

// Get me some recipes button Event Listener

querySubmit.addEventListener("click", function (event) {
    event.preventDefault();
    
    // Check if any of the select elements are null or undefined

    if (!ingredient || !cuisineType || !mealType) {
        // Show the warning modal
        warningModal.className = "modal is-active";
        warningModal.querySelector(".modal-background").addEventListener("click", function() {
        warningModal.className = "modal";
        });
        warningModal.querySelector(".modal-close").addEventListener("click", function () {
            warningModal.className = "modal";
            event.stopPropagation();
        });

    } else {
        // All select elements are selected, proceed with getting recipes
        console.log("User can search for recipes when clicking")
        event.preventDefault();
        getRecipesList();
        mainModal.classList.remove("is-active");  // Switch from main modal to loading page
        loadingModal.classList.add("is-active");  // Activate loading modal page

        // Set a timeout of 6 seconds (6000 milliseconds)
        setTimeout(function() {
            loadingModal.classList.remove("is-active");  // Remove is-active class from loadingModal
            recipeListModal.classList.add("is-active");
        }, 6000);
    }
});


// Cancel button event listener

recipeListCancelBtn.addEventListener("click", function() {
    mainModal.classList.add("is-active");
})

// Back to main event listener

backtoMainBtn.addEventListener("click", function() {
    mainModal.classList.add("is-active");
})


// Clear previous recipes list

clearLocalStorage.addEventListener ("click", function() {
    previousSearchUl.innerHTML = "";
    localStorage.clear();
})

// Back to list button event listener

backBtn.addEventListener("click", function() {
    recipeListModal.classList.add("is-active");
})
