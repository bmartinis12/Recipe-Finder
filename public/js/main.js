// Variables 

let ingredientBtn = $('.ingredient-btn');
let ingredientForm = $('.ingredient-form');
let categoryBtn = $('.category-btn');
let categoryForm = $('.category-form');
let areaBtn = $('.area-btn');
let areaForm = $('.area-form');
let randomBtn = $('.random-btn');
let autoResults = $('.auto-results');
let container = $('.container');
import { ingredientList  } from "./lists/ingredientList.mjs";
import { categoryList } from "./lists/categoryList.mjs";
import { areaList } from "./lists/areaList.mjs";

// function to get recipe info 

async function getData(url){
    return await fetch(url)
        .then((response) => response.json())
        .then((data) => data);
}

// Function to change search bars css properties 

function changeSearchBar(element){
    let searchBars = [ingredientForm, categoryForm, areaForm];
    searchBars.splice(searchBars.indexOf(element), 1);
    searchBars.forEach((bar) => {
        bar.css('display', 'none');
    });
    element.css('display', 'flex');
}

// Functions to find autocomplete options for search bars and add them below the search bar

function autoCompleteMatch(input, terms) {
    if (input == '') {
        return [];
    }
    input = input.replace(/[^A-Za-z\s]/g, '')
    let reg = new RegExp(input)
    let matches = terms.filter(function(term) {
        return term.toLowerCase().startsWith(input.toLowerCase()); 
    });
    if(matches.length > 0){
        showResults(matches.splice(0,4));
    } else {
        autoResults.css('display', 'none');
    }
}


function showResults(matches){
    autoResults.css('display', 'flex');
    autoResults.html("");
    let list = ``;
    matches.forEach((match) => {
        list += `
            <p class="match">${match}</p>
        `;
    });
    autoResults.html(list);
}

// Function to create recipe cards 

function createCards(recipes){
    container.html("");
    let cards = ``;
    recipes.forEach((recipe) => {
        cards += `
            <div class='card'>
                <img src='${recipe.strMealThumb}' alt='${recipe.strMeal}'/>
                <p>${recipe.strMeal}</p>
                <a href='/recipe?id=${recipe.idMeal}'>Details</a>
            </div>
        `
    });
    container.html(cards);
    $('footer').css('position', 'static');
    //$('footer').css('position', 'absolute');
}

$( function(){

    // Display the differnt search bars depending on what user clicks in dropdown menu

    ingredientBtn.on('click', function(){
        changeSearchBar(ingredientForm);
        autoResults.css('display', 'none');
    });

    categoryBtn.on('click', function(){
        changeSearchBar(categoryForm);
        autoResults.css('display', 'none');
    });

    areaBtn.on('click', function(){
        changeSearchBar(areaForm);
        autoResults.css('display', 'none');
    });

    // Ingredient form submitted 

    ingredientForm.on('submit', async function(e){
        e.preventDefault();
        autoResults.css('display', 'none');
        let input = $('.ingredient-query').val();
        input = input.replace(/[^A-Za-z\s]/g, '')
        if(input == '' || !input){
            alert('Please enter an ingredient!')
            input = "";
            return;
        } else if(!ingredientList.find((ingredient) => ingredient.toLowerCase() == input.toLowerCase())){
            alert(`Please enter a valid ingredient! \n If you are having trouble check our suggested searches for help.`)
            input = "";
            return;
        };
        let recipes = await getData(`/ingredientsearch/${input}`);
        createCards(recipes);
    });

     // Category form submitted 

     categoryForm.on('submit', async function(e){
        e.preventDefault();
        autoResults.css('display', 'none');
        let input = $('.category-query').val();
        input = input.replace(/[^A-Za-z\s]/g, '')
        if(input == '' || !input){
            alert('Please enter an category!')
            input = "";
            return;
        } else if(!categoryList.find((category) => category.toLowerCase() == input.toLowerCase())){
            alert(`Please enter a valid category! \n If you are having trouble check our suggested searches for help.`)
            input = "";
            return;
        };
        let recipes = await getData(`/categorysearch/${input}`);
        createCards(recipes);
    });

    // Area form submitted 

    areaForm.on('submit', async function(e){
        e.preventDefault();
        autoResults.css('display', 'none');
        let input = $('.area-query').val();
        input = input.replace(/[^A-Za-z\s]/g, '')
        if(input == '' || !input){
            alert('Please enter an area!')
            input = "";
            return;
        } else if(!areaList.find((area) => area.toLowerCase() == input.toLowerCase())){
            alert(`Please enter a valid area! \n If you are having trouble check our suggested searches for help.`)
            input = "";
            return;
        };
        let recipes = await getData(`/areasearch/${input}`);
        createCards(recipes);
    });

    // Ingredients key clicked

    ingredientForm.on('keyup', function(){
        let input = $('.ingredient-query').val();
        autoCompleteMatch(input.toLowerCase(), ingredientList);
    });

    // Category key clicked

    categoryForm.on('keyup', function(){
        let input = $('.category-query').val();
        autoCompleteMatch(input.toLowerCase(), categoryList);
    });

    // Area key clicked

    areaForm.on('keyup', function(){
        let input = $('.area-query').val();
        autoCompleteMatch(input.toLowerCase(), areaList);
    });

    // Autocomplete match clicked 
    autoResults.on('click', function(e){
        let clicked = e.target.innerText;
        if(ingredientForm.css('display') == 'flex') {
            $('.ingredient-query').val(clicked);
            ingredientForm.submit();
        } else if(categoryForm.css('display') == 'flex') {
            $('.category-query').val(clicked);
            categoryForm.submit();
        } else if (areaForm.css('display') == 'flex') {
            $('.area-query').val(clicked);
            areaForm.submit();
        }
    });

    // Click on random button 
    randomBtn.on('click', async function(){
       let id =  await getData(`/random`);
       console.log(id);
       window.location.replace(`/recipe?id=${id}`);
    })
});