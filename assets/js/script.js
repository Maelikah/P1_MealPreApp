function getEdamanData() {

    var app_id = "1f6d88b8"; // Replace with your Edamam app ID
    var app_key = "7537eeca1e7b8144211802174e66b65a"; // Replace with your Edamam app key
    var query = "chicken"; // Replace with the ingredient you want to search for
    
    var endpoint = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}&q=${query}`;
    
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract the recipe data from the response
            const recipes = data.hits || [];
            for (const recipe of recipes) {
            // Extract relevant information from the recipe data
            const recipe_name = recipe.recipe.label || "Unknown";
            const recipe_url = recipe.recipe.url || "";
            console.log(`Recipe: ${recipe_name}`);
            console.log(`URL: ${recipe_url}`);
            }
        })
        .catch(error => {
            console.error(error);
        });
}