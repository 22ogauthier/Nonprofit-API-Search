//JAVASCRIPT FILE FOR NONPROFIT API

window.onload = (e) => {
    //When the window is loaded, assign a function to an onclick handler
    document.querySelector("#search").onclick = searchButtonClicked;

    const nameField = document.querySelector("#searchterm");
    const prefix = "org1181-";
    const nameKey = prefix + "name"
    const storedName = localStorage.getItem(nameKey);
    if (storedName){
        nameField.value = storedName;
    }else{
        nameField.value = "Type causes here..."; // a default value if `nameField` is not found
    }
    nameField.onchange = e=>{ localStorage.setItem(nameKey, e.target.value); };
}

//keep track of what the user inputs for search
let displayTerm = "";

function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const NONPROFIT_URL = "https://partners.every.org/v0.2/search/";

    const NONPROFIT_KEY = "pk_live_14ddea47955cf33089a590b617398068";

    //Get the input from the text box
    let term = document.querySelector("#searchterm").value;
    console.log(document.querySelector("#searchterm"));

    //Trim extra space from the beginning and end
    term = term.trim();
    localStorage.setItem('lastSearchItem', term);
    console.log(term);

    //store search term into a variable
    displayTerm = term;

    //encodes spaces and special characters for the url
    term = encodeURIComponent(term);
    console.log("Encoded: ", term);

    //nothing in box -> bail
    if (term.length < 1) return;

    //update URL to include the search term
    url = NONPROFIT_URL + term + "?apiKey=" + NONPROFIT_KEY;
    console.log(url);

    //gets the number of results per page DOUBLE CHECK THIS API'S "TAKE" VARIABLE
    url += "&take=" + document.querySelector("#limit").value;

    //update status HTML
    document.querySelector("#status").innerHTML =
        "<b>Searching for '" + displayTerm + "'</b>";

    getData(url);
}

function getData(url) {
    //creates an XHR object
    let xhr = new XMLHttpRequest;

    //call a function on object
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    //what HTTP request
    xhr.open("GET", url);

    xhr.send();
}

function dataLoaded(e) {
    console.log("DATA LOADED:", e);

    //get back our "browser"
    let xhr = e.target;

    //if you had opened the URL in a browser instead of an AJAX reqest, you would see this
    console.log(xhr.responseText);
    let obj = JSON.parse(xhr.responseText);
    console.log("DATA", obj);

    //no data
    if (!obj.nonprofits || obj.nonprofits.length == 0 || obj.nonprofits.length > document.querySelector("#searchterm").value) {
        document.querySelector("#status").innerHTML = "<b>No results for '" + displayTerm + "'</b>";
        return;
    }

    //local variable
    let results = obj.nonprofits;

    let bigString =
        "<p><i>Here are " +
        results.length +
        " results for '" +
        displayTerm +
        "'</i></p>"

    //go through and create a DOM element
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //grab the rating 
        let line = '<div class="result">';
        line += `<img src="${result.logoUrl}" alt="" />`;
        line += '<span class="name">' + result.name + '</span>';
        line += '<span class="description">' + result.description + "..." + '</span>';
        line += '<span class="location">' + result.location.toUpperCase() + '</span>';
        line += `<span><a href="${result.websiteUrl}" class="link" target="_blank" >Learn More!</a></span>`;
        line += '<div class="tags">';
        for (let tag of result.tags) {
            line += `<span class="tag">${tag}</span>`;
        }
        line += '</div>';

        line += `</div>`;

        bigString += line;
    }

    //Replace #content HTML with our "bigString"
    document.querySelector("#content").innerHTML = bigString;
    document.querySelector("#status").innerHTML = "<b>Success!</b>";
}

function dataError(e) {
    console.log("ERROR:", e);
}

