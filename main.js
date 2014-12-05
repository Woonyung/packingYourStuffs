/*
 _  _     _                                      _   _           
| || |___| |_ __   _  _ ___ _  _   _ __  __ _ __| |_(_)_ _  __ _ 
| __ / -_) | '_ \ | || / _ \ || | | '_ \/ _` / _| / / | ' \/ _` |
|_||_\___|_| .__/  \_, \___/\_,_| | .__/\__,_\__|_\_\_|_||_\__, |
           |_|     |__/           |_|                      |___/

with Woon and Neva :)

- D-day calculate doesn't work for now...
*/

var calculate;

var weatherDataArray = [];

var purposes = {
    'business': false,
    'skiing': false,
    'swimming': false
}


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
var stuff = '';

/*
    possible weathers:
    thunderstorm, drizzle, rain, snow, atmosphere (volcanic ashes, tornado), 
    clouds, extreme ( hail, tornado)
*/


// empty array for holding all the items that matches to the tags
var emptyStuffObject = {};


////////////
var businessThing = "<div class='objects businessThing'><img id='folder' src='images/folder.png'></div>";
var swimmingThing = "<div class='objects swimmingThing' ><img id='bikini' src='images/bikini.png'></div>";
var skiingThing = "<div class='objects skiingThing'><img id='hat' src='images/hat.png'></div>";
///////////


function getCurrentWeatherData(city){
    var myURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='
                + city + '&mode=json&units=metric&cnt=12';
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
                var weather = data.list[i].weather[0].main;
                var weatherDetail = data.list[i].weather[0].description;
                
                var unixDate = data.list[i].dt;

                var d = new Date(unixDate * 1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var month = months[d.getMonth()];
                var date = d.getDate();

                var ourDate = month + ". " +date;

                ///// ICON ////
                // looping through our icon object
                for ( var key in ourIcon){
                    // console.log(ourIcon[key]); // images/01d.png               
                    // if icon id is matched, display with our icons
                    if ( key === iconID ){
                        //console.log("we have matched one");
                        iconImage = '<img src="' + ourIcon[key] + '">';
                    } 
                }


                //// WEATHER ////
                if ( weather.toLowerCase() === 'rain' || weather.toLowerCase() === 'drizzle'  ){
                    //stuff = '*** UMBRELLA ***';
                }
                if ( weather.toLowerCase() === 'snow'){

                };
                if ( weather.toLowerCase() === 'clear' || weather.toLowerCase() === 'clouds' ){
                    //stuff = '*** sunblock cream ***';
                }

                // append to the div
                if ( i < 6 ){
                    $('#dataPrint_top').append( '<div class="dateDiv"'+ 'id="'+ unixDate +'">' + ourDate + '</a>' + ' ' +
                                        'max: ' + maxTemp + 
                                        ' min: ' + minTemp + ' ' + 
                                        iconImage + ' ' +
                                        weather + ' ' + 
                                        stuff + '</div>');
                } else {
                    $('#dataPrint_bottom').append( '<div class="dateDiv"'+ 'id="'+ unixDate +'">' + ourDate + '</a>' + ' ' +
                                        'max: ' + maxTemp + 
                                        ' min: ' + minTemp + ' ' + 
                                        iconImage + ' ' +
                                        weather + ' ' + 
                                        stuff + '</div>');
                }
            }


            // hover effect
            $('.dateDiv').hover(function(){ // hover
                $(this).toggleClass("dateDivHover");
            }).click(function(){ // click

                if (calculate !== undefined) {
                    clearInterval(calculate);
                }

                var countdown = document.getElementById("countdown");
                $(countdown).html('');

                var travelDate = parseInt(this.id) * 1000; // get millisecond
                //console.log(travelDate);

                // it will run every second
                
                calculate = setInterval(function(){
                    // variables for time units
                    var days, hours, minutes, seconds;
                    // find the amount of "seconds" between now and target
                    var today = new Date().getTime();
                    var seconds_left = (travelDate - today) / 1000;

                    // do some time calculations
                    days = parseInt(seconds_left / 86400);
                    seconds_left = seconds_left % 86400;
                     
                    hours = parseInt(seconds_left / 3600);
                    seconds_left = seconds_left % 3600;
                     
                    minutes = parseInt(seconds_left / 60);
                    seconds = parseInt(seconds_left % 60);

                    // format countdown string + set tag value
                    countdown.innerHTML = days + "d, " + hours + "h, "
                    + minutes + "m, " + seconds + "s";  
                }, 1000); 

            });

        },
        error: function(data){
            console.log("error");
        }
    });
}

function loadStuffs(purposes){
   //////////////////////////////////////////
   // get json file
   $.getJSON( "stuff.json", function(data) {
        var results = data;
        emptyStuffObject[purposes] = [];

       // looping through all stuffs
       for ( var item in results){
           //console.log(item); // name
           //console.log(results[item]);
           var tempItem = results[item];

           // if tags are matched with purposes  
           if ( _.contains(results[item].tags, purposes)) {
                console.log("business is found");
                emptyStuffObject[purposes].push(results[item]);
           }
   
       }
       console.log(emptyStuffObject);
   });
}

$(document).ready(function(){

    // scroll library <3
    $(".main").onepage_scroll({
        sectionContainer: "section",
        responsiveFallback: 600,
        animationTime: 1000,
        afterMove: function(index) {
          // bag animation
          console.log("moved");
        }, 
        loop: true,
        keyboard: true,

        direction: 'vertical'
    });


    ////////// SECTION 1 //////////

    // when search button is pressed
    $('#searchWeather').click(function(){
        // empty the div first
        $('#dataPrint').html('');

        // get the city value from inputs
        var city = $('#city').val();
        console.log(city);

        // get weather API data
        getCurrentWeatherData(city);
    });


    ////////// SECTION 2 //////////
    // purposes tags 
    $("#business").toggle(
        function () {
            $(this).css({"background-color":"red"});
            purposes['business'] = true;
            //console.log( purposes['business']); // true
            if(purposes['business'] == true) {
                console.log("true");
                loadStuffs('business');
                $('#bagDiv').prepend(businessThing);
            }
        },
        function () {
          $(this).css({"background-color":"black"});
          purposes['business'] = false;
          $('.businessThing').html('');

    });


    $("#swimming").toggle(
        function () {
            $(this).css({"background-color":"red"});
            purposes['swimming'] = true;
            //console.log( purposes['swimming']); // true
            // if(purposes['swimming'] == true) {
            //     console.log("true");
            //     $('#bagDiv').prepend(swimmingThing);
            // }
        },
        function () {
          $(this).css({"background-color":"black"});
          purposes['swimming'] = false;
          //console.log( purposes['swimming']); // false
          $('.swimmingThing').html('');
    });

    $("#skiing").toggle(
        function () {
            $(this).css({"background-color":"red"});
            purposes['skiing'] = true;
            //console.log( purposes['skiing']); // true
            if(purposes['skiing'] == true) {
                console.log("true");
                $('#bagDiv').prepend(skiingThing);
            }
        },
        function () {
          $(this).css({"background-color":"black"});
          purposes['skiing'] = false;
          //console.log( purposes['skiing']); // false
          $('.skiingThing').html('');
    });

   $('#clear').click(function(){
        $('#bagDiv').html('');
   });

   // get json

});