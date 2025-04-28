var apikey = "SECRET";
var lat;
var long;
var matchFound = false;
var latOnLand;
var longOnLand;
var index = 0;
var isRunning = false;

async function getSVImageRandomLatLong()
{
    if(!isRunning)
    {
        isRunning = true
        await lookForMatch();
        await setSVImage();
        await printCountryName();
        isRunning = false;     
    }
}

async function lookForMatch()
{
    let numTries = 0;   
    let metadata_url;
    let maxTries = 500
    
    while(numTries < maxTries){
        await getRandomLatLongOnLand()
        metadata_url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${long}&key=${apikey}`;          
        let response = await fetch(metadata_url);
        let data = await response.json();
        console.log(data.status);
                
        if(data.status == "OK" && data.copyright == "© Google")
        {
            console.log(`lat: ${lat} long: ${long}`);
            console.log("Metadata url: " + metadata_url);
            numTries = 0;
            break;
        }
        numTries++;  
    }
}

async function printCountryName()
{
    try{
        reverseGeocode_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apikey}`;
        console.log("Reversegeocode url: " + reverseGeocode_url);
        var response = await fetch(reverseGeocode_url);
        var data = await response.json();
        var country = data.plus_code.compound_code;
        country = country.split(",").pop();
        document.getElementById("ReverseGeoCodeData").innerHTML += country;
    }
    catch(error)
    {
        country = data.results[0].formatted_address;
        country = country.split(",").pop();
        document.getElementById("ReverseGeoCodeData").innerHTML += country;
    }
}


function setSVImage()
{
    
    let imageurl = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${lat},${long}&key=${apikey}`;
    var streetview = document.createElement('img');
    streetview.setAttribute('src', imageurl ) ;
    document.body.appendChild(streetview);
    console.log("Image url: " + imageurl);
    document.getElementById("img_urls").innerText += imageurl + "\n";
}


async function getRandomLatLongOnLand()
{     
    let api_url = "https://api.3geonames.org/?randomland=yes&json=1"
    let response = await fetch(api_url);
    let data = await response.json();
    lat = data.nearest.latt;
    long = data.nearest.longt;
}
