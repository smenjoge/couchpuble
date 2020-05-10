# couchpuble
## Project1 - Supreme group - Travel Search
1) In this app, we are using bootstrap classes such as navbar, container and input group components to 
    design our html
2) To get the data/results to display on the screen, we are using mainly three  APIs a) Open Weather API 
    b) Google Geocoding API and c) Google Places API. The use of each of them is described below.
3) User is asked to enter an address, city name or an attraction name in the seach box. 
4) User's input is converted to latitude and longitude information using Google Geocoding API.
5) Using the latitude and longitude information, we get the current weather data for that location. This 
    weather data is displayed to the user. The weather information is also used to prioratize what types of 
    places to suggest to user. 
6) Using the latitude and longitude information, the next call is made to the Google places API using the 
    Nearby Search request type. The response from the API consists of an array of matching places.
7) The places array in the response is then processed in a loop. For each place, we next call Google places
    API Place Details request type. The response from this API call has additional details for the place like
    address, phone number, ratings etc.
8) For each place, a call is made to  Google places API Place Photos request type to get a photo of the place.
9) All this inforamation that we gathered about the place is then displayed on the screen. 
10) User's last search is saved in local storage. When user loads the app first time or refreshes the browser 
    window, user's last search results are displayed to them.