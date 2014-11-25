var weatherDataArray = [];
var ourIcon = {
    '01d' : 'images/01d.png', 
    '02d' : 'images/02d.png',
    '03d' : 'images/01d.png', 
    '04d' : 'images/02d.png',
    '09d' : 'images/01d.png', 
    '10d' : 'images/02d.png',
    '11d' : 'images/01d.png', 
    '13d' : 'images/02d.png',
    '50d' : 'images/02d.png',

    '01n' : 'images/01d.png', 
    '02n' : 'images/02d.png',
    '03n' : 'images/01d.png', 
    '04n' : 'images/02d.png',
    '09n' : 'images/01d.png', 
    '10n' : 'images/02d.png',
    '11n' : 'images/01d.png', 
    '13n' : 'images/02d.png',
    '50n' : 'images/02d.png'
};
var iconImage;

function getCurrentWeatherData(city){
    var myURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='
                + city + '&mode=json&units=metric&cnt=7';
    $.ajax({
        url: myURL,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);


            for ( var i = 0; i < data.list.length; i++){
                var maxTemp = data.list[i].temp.max;
                var minTemp = data.list[i].temp.min;
                var iconID = data.list[i].weather[0].icon;

                //console.log(iconID);

                // looping through our icon object
                for ( var key in ourIcon){
                    // console.log(ourIcon[key]); // images/01d.png 
                    
                    // if icon id is matched, display with our icons
                    if ( key === iconID ){
                        console.log("we have matched one");
                        iconImage = '<img src="' + ourIcon[key] + '">';
                    } 
                    // this one doesn't work
                    // else {
                    //     console.log("we don't have that");
                    //     iconImage = '<img src="http://openweathermap.org/img/w/50n.png">';
                    // }
                }

                // append to the div
                $('#dataPrint').append('max: ' + maxTemp+ ' min: ' + minTemp + ' ' + iconImage + '<br>');
            }

        },
        error: function(data){
            console.log("error");
        }
    });
}

$(document).ready(function(){


    $('#searchWeather').click(function(){
        $('#dataPrint').html('');

        //console.log("this button is clicked");
        var city = $('#city').val();
        console.log(city);

        // get weather API data
        getCurrentWeatherData(city);
    });

});