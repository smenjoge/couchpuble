// All variables are declared global as all of them are used across functions. 
var lat ;
var long ;
var weatherCondition;
var CurrentTemp;
var placeName ;
var address;
var photoURL;
var inputAddress;
var searchType;
var placeID ;
var  photoreference;
var cityName;
var currentConditions; 
var townName;
var detachDiv;
var weatherAPIKey = "07f0e0a67e0b50a9e658e6cfe5b0368a"; 
var googleAPIKEY = "AIzaSyCDdXamhyDjtM8Ttl4n3oKoRtvtoBnNI_Q";

// Event Handler for Search button. Read the unser Input and pass it to the next fuction
$("#button-addon2").on("click", function () {
    if(detachDiv) {
        $("#today").empty();
        $(".listResults").empty();
        $(".listResults").append(detachDiv);
    }
    inputAddress = $("#searchText").val();
    latAndLong();
});
    
// function for converting user input to location coordinates. This used Google GEOCODING API
function latAndLong() {
    //call places API with below URL to get Place details
    placeDetailsURL ="https://maps.googleapis.com/maps/api/geocode/json?address="+ inputAddress + "&key=" + googleAPIKEY;
    $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: placeDetailsURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }}).then(function(response) {
        lat = response.results[0].geometry.location.lat;
        long = response.results[0].geometry.location.lng;
        $(".displayContainer").removeClass("invisible");

        var lastSearch = {"latitude": lat, "longitude": long };
        localStorage.setItem("lastSearch", JSON.stringify(lastSearch));

        callWeatherAPI();
    });
};

// Function to call weather API using the latitue and longitude found from GEOCODING API. 
function callWeatherAPI () {
var weatherApiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + weatherAPIKey;
$.ajax({
    url: weatherApiURL,
    method: "GET"
    }).then(function(response) {
        console.log(response);
        weatherCondition = response.weather[0].main; //Weather conditions
        CurrentTemp = parseFloat(response.main.temp);
        var townName = response.name;
        var feelslike = response.main.feels_like;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        var iconImg = $("<img>").attr("src", iconURL);
        var newDiv1 = $("<div class='city'>").text(townName + " " + moment().format("MM/DD/YYYY"));
        $("#today").append(newDiv1);
        $("#today").append(iconImg);
        var newDiv2 = $("<div>").text("Temperature: " + CurrentTemp + "°F");
        $("#today").append(newDiv2);
        var newDiv3 = $("<div>").text("Feels Like: " + feelslike + "°F");
        $("#today").append(newDiv3);
        var newDiv4 = $("<div>").text("Wind Speed: " + wind + "MPH");
        $("#today").append(newDiv4);
        var newDiv5 = $("<div>").text("Humidity: " + humidity + "%");
        $("#today").append(newDiv5);   

        if ((weatherCondition == "Clear"  || weatherCondition == "Clouds") && CurrentTemp > 60) {
            searchType = "tourist_attraction"; 
        } else {
            searchType = "cafe";
        }
        findPlacesNearBy();
    });
};

// This function processes the list of places returned from Places API in a loop call another function to and show the results to user. 
async function findPlacesNearBy() {
    
    var resp1 = await getPlaces();

    for (i=0; i < 5; i++) {
        placeName = resp1.results[i].name;
        placeID = resp1.results[i].place_id;
        photoreference = resp1.results[i].photos[0].photo_reference;
        var resp2 = await getPlaceDetials();
        var placedetailsObj = resp2.result;
        address = placedetailsObj.formatted_address
        var photoURL = await getPlacePhoto();
        createNewDiv(placeName, address, photoURL);
    }
    detachDiv = "";
    detachDiv = $(".place").detach();
};

// Function to call Google palces API using the latitue and longitude found from GEOCODING API. Places API is used to get Nearby Search results withing a radius of 5000mtrs
function getPlaces(){
    googleApiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=5000&type=" + searchType + "&key=" + googleAPIKEY;
    
    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: googleApiURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
};

// This function calls Google Places API - Get place details mode to get additional details for each place. 
function getPlaceDetials() {
    //call places API with below URL to get Place details
    placeDetailsURL ="https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&fields=formatted_address&key=" + googleAPIKEY;

    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors",
        method:"POST",
        data: {
        url: placeDetailsURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
};

// This function calls Google Places API - Get photo mode to get a photo referece for each place. 
function getPlacePhoto() {
    //call places API again with below URL to get photo
    photoAPIURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoreference + "&key=" + googleAPIKEY;
    return $.ajax({
        url: "https://limitless-tor-79246.herokuapp.com/cors/google/places/photoUrl",
        method:"POST",
        data: {
        url: photoAPIURL,
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5"
    }})
};

// This function creates a new div and appends to the html container where results are displayed to the user. 
function createNewDiv (placename, address, photoUrl) {
    
    console.log(address);
    console.log(photoUrl);
    var newCard = $(".place").clone();
    newCard.removeClass("invisible");
    newCard.removeClass("place");
    newCard.find(".placeImg").attr({src: photoUrl, alt: placename});
    newCard.find(".card-title").text(placename);
    newCard.find(".card-text").text(address);
    var listDiv =  $(".listResults");
    
    listDiv.append(newCard);
};


// For Initial page load or when user clicks on browser refresh button, get the last searched place and display the results
var lastSearch = JSON.parse(localStorage.getItem("lastSearch"));
if (lastSearch) {
    lat = lastSearch.latitude;
    long = lastSearch.longitude;
    $(".displayContainer").removeClass("invisible");
    callWeatherAPI();
};