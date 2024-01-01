const API_key="01fbbdcc4522ec2298953523973417bb";

let gif=document.querySelector(".loading-gif");

let errorContainer=document.querySelector(".error-container");

let searchBarContainer=document.querySelector(".search-container");

let weatherDetailsContainer=document.querySelector(".weather-details-container");

let searchWeatherBtn=document.querySelector("[search-weather-btn]");
let yourWeatherBtn=document.querySelector("[your-weather-btn]");
let grantAccessContainer=document.querySelector(".grant-access-container");

let grantAccessButton=document.querySelector("[data-grantAccess]");

let errorMsg=document.querySelector(".error-msg");


handleYourWeatherButton();




// Handling functionality of your weather button


yourWeatherBtn.addEventListener("click",handleYourWeatherButton);


function handleYourWeatherButton(){

    if(searchBarContainer.classList.contains("search-container-active")){
        searchWeatherBtn.classList.remove("weather-btn-active");
        yourWeatherBtn.classList.add("weather-btn-active");
        errorContainer.classList.remove("error-container-active");
        searchBarContainer.classList.remove("search-container-active");
        weatherDetailsContainer.classList.remove("weather-details-container-active");
        gif.classList.add("loading-gif-active");
        getCoordinatesfromSession();

        
    }
    else if(!searchBarContainer.classList.contains("search-container-active")){
        
        yourWeatherBtn.classList.add("weather-btn-active");

        getCoordinatesfromSession();
    }
}

function getCoordinatesfromSession(){
    const userCoordinates=sessionStorage.getItem("user-coordinates");

    if(!userCoordinates){
        gif.classList.remove("loading-gif-active");
        
        grantAccessContainer.classList.add("grant-access-container-active");
    }
    else{
        const coordinates=JSON.parse(userCoordinates);
        fetchWeatherDetailsWithLat_Long(coordinates);
    }
}


async function fetchWeatherDetailsWithLat_Long(coordinates){
    
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("grant-access-container-active");
    gif.classList.add("loading-gif-active");
    
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        let data=await response.json();
        renderWeatherDetails(data);
    }
    catch(err){
        gif.classList.remove("loading-gif-active");
        errorMsg.innerText="Failed to Fetch";
        errorContainer.classList.add("error-container-active");
    }

}


function renderWeatherDetails(data){

    let temp=document.querySelector(".temp");
    let cityName=document.querySelector("[data-cityName]");
    let countryIcon=document.querySelector("[data-countryIcon]");
    let weatherType=document.querySelector(".weather-type");
    let weatherTypeImg=document.querySelector(".weather-type-img");
    let windspeedMetric=document.querySelector("#windspeed-metric");
    let humidityMetric=document.querySelector("#humidity-metric");
    let cloudsMetric=document.querySelector("#clouds-metric");
    
    gif.classList.remove("loading-gif-active");
    if(`${data?.name}`==="undefined"){
        errorMsg.innerText="City not Found";
        errorContainer.classList.add("error-container-active");
        return;
    }
    cityName.innerText=`${data?.name}`;
    
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherType.innerText=`${data?.weather?.[0]?.description}`;
    weatherTypeImg.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.textContent=`${data?.main?.temp.toFixed(2)} °C`;
    windspeedMetric.innerText=`${data?.wind?.speed}m/s`;
    humidityMetric.innerText=`${data?.main?.humidity}%`;
    cloudsMetric.innerText=`${data?.clouds?.all}%`;

    weatherDetailsContainer.classList.add("weather-details-container-active");
    
}


// Handling functionality of search weather button


searchWeatherBtn.addEventListener("click",handleCustomSearch);

function handleCustomSearch(){

    if(searchBarContainer.classList.contains("search-container-active")){
        
        return;
    }
    else{
        yourWeatherBtn.classList.remove("weather-btn-active");
        searchWeatherBtn.classList.add("weather-btn-active");
        
        grantAccessContainer.classList.remove("grant-access-container-active");
        errorContainer.classList.remove("error-container-active");
        
        weatherDetailsContainer.classList.remove("weather-details-container-active");

        searchBarContainer.classList.add("search-container-active");

        let searchBtn=document.querySelector(".search-button");

        searchBtn.addEventListener("click",fetchWeatherDetailsWithCity);
    }

    
}

let searchBar=document.querySelector(".search-bar");

async function fetchWeatherDetailsWithCity(event){
    
   event.preventDefault();
   
    if(!searchBar.value){
        return;
    }
    let city=searchBar.value;
    searchBar.value="";

    try{
        errorContainer.classList.remove("error-container-active");
        weatherDetailsContainer.classList.remove("weather-details-container-active");
        gif.classList.add("loading-gif-active");
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data= await response.json();
        renderWeatherDetails(data);
    }
    catch(err){
        gif.classList.remove("loading-gif-active");
        weatherDetailsContainer.classList.remove("weather-details-container-active");
        errorMsg.innerText="Failed to Fetch";
        errorContainer.classList.add("error-container-active");
    }
    
}

function getUserLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation feature not supported");
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchWeatherDetailsWithLat_Long(userCoordinates);

}

grantAccessButton.addEventListener("click",getUserLocation);



















