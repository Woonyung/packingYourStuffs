/*
 _  _     _                                      _   _           
| || |___| |_ __   _  _ ___ _  _   _ __  __ _ __| |_(_)_ _  __ _ 
| __ / -_) | '_ \ | || / _ \ || | | '_ \/ _` / _| / / | ' \/ _` |
|_||_\___|_| .__/  \_, \___/\_,_| | .__/\__,_\__|_\_\_|_||_\__, |
           |_|     |__/           |_|                      |___/

with Woon and Neva :)

- try to make click button function - that passes tagsname as parameters
and try to append images from the json file that we have
*/

var calculate;

var weatherDataArray = [];

var purposes = {
    'business': false,
    'skiing': false,
    'swimming': false
};


var ourIcon = {
    '01d' : 'public/images/01d.png', 
    '02d' : 'public/images/02d.png',
    '03d' : 'public/images/01d.png', 
    '04d' : 'public/images/02d.png',
    '09d' : 'public/images/01d.png', 
    '10d' : 'public/images/02d.png',
    '11d' : 'public/images/01d.png', 
    '13d' : 'public/images/02d.png',
    '50d' : 'public/images/02d.png',

    '01n' : 'public/images/01d.png', 
    '02n' : 'public/images/02d.png',
    '03n' : 'public/images/01d.png', 
    '04n' : 'public/images/02d.png',
    '09n' : 'public/images/01d.png', 
    '10n' : 'public/images/02d.png',
    '11n' : 'public/images/01d.png', 
    '13n' : 'public/images/02d.png',
    '50n' : 'public/images/02d.png'
};
var iconImage;
var stuff = '';

// empty array for holding all the items that matches to the tags
var stuffToPack = {};

// // //////////// temporary thing
// var businessThing = "<div class='objects businessThing'><img id='folder' src='images/folder.png'></div>";
// var swimmingThing = "<div class='objects swimmingThing' ><img id='bikini' src='images/bikini.png'></div>";
// var skiingThing = "<div class='objects skiingThing'><img id='hat' src='images/hat.png'></div>";
// // ///////////


/*
    possible weathers:
    thunderstorm, drizzle, rain, snow, atmosphere (volcanic ashes, tornado), 
    clouds, extreme ( hail, tornado)
*/
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
    // console.log("i am in loadStuff :" + myJsonStuff);
  
    stuffToPack[purposes] = [];

    // looping through all stuffs
    for ( var item in myJsonStuff){
        // console.log(item); // name

        // if tags are matched with purposes  
        if ( _.contains(myJsonStuff[item].tags, purposes)) {
             stuffToPack[purposes].push(myJsonStuff[item]);        
        }
    }
    console.log(stuffToPack);
    // for ( var purpose in stuffToPack){
    //     for ( var i = 0; i < stuffToPack[purpose].length; i++){
    //         console.log(stuffToPack[purpose][i].url);
    //         var image = stuffToPack[purpose][i].url;
    //         $('#bagDiv').prepend('<img src="' + image + '">');
    //     }
    // }

    return stuffToPack;
}

function updateImages(stuffToPack){
    console.log("showing images function");
    // first, clear the div
    $('#bagDiv').empty();
    for ( var purpose in stuffToPack){
        for ( var i = 0; i < stuffToPack[purpose].length; i++){
            console.log(stuffToPack[purpose][i].url);
            var image = stuffToPack[purpose][i].url;
            $('#bagDiv').prepend('<img src="public/' + image + '" style="width:20%;">');
        }
    }
}

var myJsonStuff = {};
var gotJSON = false;

function dealWithResults(data){
    //do all stuff with results here;
    console.log(data);
    myJsonStuff = data;
    gotJSON = true;
}


function clickbutton (tagg){
    console.log("click button function");
    $("#"+tagg).toggle(
        function () {
            $(this).css({"background-color":"red"});
            purposes[tagg] = true;
            console.log( purposes[tagg]); // true
            if(purposes[tagg] == true) {
                console.log("true");

                // load json file
                if(gotJSON){
                    //do stuff
                    // console.log(myJsonStuff);
                    var allItems = loadStuffs(tagg);
                    // socket event to send stuffToPack data
                    updateImages(stuffToPack);
                    console.log(stuffToPack);
                }
                else{
                    console.log("json not loaded");
                }

            } 
        },
        function () {

            $(this).css({"background-color":"black"});
            purposes[tagg] = false;
            //console.log( purposes['skiing']); // false
            //$('#bagDiv').html('');
            //loadStuffs(tagg);

            // remove from object if we clicked button again 
            delete stuffToPack[tagg];
            // socket event to send stuffToPack data
            console.log(stuffToPack);
            updateImages(stuffToPack);
    });

}


$(document).ready(function(){

    $.getJSON( "public/stuff.json", dealWithResults);

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
    /// all the tags button    
    clickbutton('business');
    clickbutton('skiing');
    clickbutton('swimming');


});