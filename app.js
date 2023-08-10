// variables 

let express = require('express');
let app = express();
let ejs = require('ejs');
require('dotenv').config();
let helmet = require("helmet")

// Set EJS veiw engine

app.set('view engine', 'ejs');

// Web security

app.use(helmet({
    frameguard: {
        action: 'deny'
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "*.fontawesome.com", "'unsafe-inline'"],
            scriptSrc: ["'self'", "https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js", "*.fontawesome.com"],
            connectSrc: ["'self'", "*.fontawesome.com"],
            imgSrc: ["'self'", "https:"],
            frameSrc: ["'self'", "*.youtube.com"]
        },
    }
}))

// middleware 

app.use(express.static('public'));
app.use(express.json());

// Ingredient route

app.get('/ingredientsearch/:ingredient', async (req, res) => {
    let ingredient = req.params.ingredient;
    await fetch(`https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then((response) => response.json())
        .then((data) => res.send(data.meals));
});

// Category route

app.get('/categorysearch/:category', async (req, res) => {
    let category = req.params.category;
    await fetch(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((response) => response.json())
        .then((data) => res.send(data.meals));
});

// Area route

app.get('/areasearch/:area', async (req, res) => {
    let area = req.params.area;
    await fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        .then((response) => response.json())
        .then((data) => res.send(data.meals));
});

// Random route

app.get('/random', async (req, res) => {
    await fetch(`https://themealdb.com/api/json/v1/1/random.php`)
        .then((response) => response.json())
        .then((data) => res.send(data.meals[0].idMeal));

})

// Recipe Page EJS route

app.get('/recipe', async (req, res) => {
    let id = req.query.id;
    let meal =  await fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then((data) => data);
    let ingredients = [];
    Object.keys(meal.meals[0])
        .filter(key => ['strIngredient'].includes(key.replace(/\d/g, "")))
        .reduce((obj, key) => {
            obj[key] = meal.meals[0][key];
            if(meal.meals[0][key] != ''){
                ingredients.push(meal.meals[0][key]);
            }
            return obj;
        }, {});
    res.render('recipe.ejs', {
        name: meal.meals[0].strMeal,
        area: meal.meals[0].strArea,
        category: meal.meals[0].strCategory,
        imageURL: meal.meals[0].strMealThumb,
        videoURL: meal.meals[0].strYoutube.replace('watch?v=', 'embed/'),
        instructions: meal.meals[0].strInstructions,
        ingredient: ingredients
    });
});


// Load sever on port 3000

let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}.....`));