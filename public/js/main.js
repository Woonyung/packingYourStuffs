/*
 _  _     _                                      _   _           
| || |___| |_ __   _  _ ___ _  _   _ __  __ _ __| |_(_)_ _  __ _ 
| __ / -_) | '_ \ | || / _ \ || | | '_ \/ _` / _| / / | ' \/ _` |
|_||_\___|_| .__/  \_, \___/\_,_| | .__/\__,_\__|_\_\_|_||_\__, |
           |_|     |__/           |_|                      |___/

with Woon and Neva :)

- purposes with the lighten up button..!!!
- (person who is responsible for)
*/

var calculate;

var weatherDataArray = [];

var purposes = {
    'business': false,
    'skiing': false,
    'swimming': false
};


var ourIcon = {
    '01d' : 'public/images/weather/01d.png', 
    '02d' : 'public/images/weather/02d.png',
    '03d' : 'public/images/weather/03d.png', 
    '04d' : 'public/images/weather/04d.png',
    '09d' : 'public/images/weather/09d.png', 
    '10d' : 'public/images/weather/10d.png',
    '11d' : 'public/images/weather/11d.png', 
    '13d' : 'public/images/weather/13d.png',
    '50d' : 'public/images/weather/50d.png',

    '01n' : 'public/images/weather/01d.png', 
    '02n' : 'public/images/weather/02d.png',
    '03n' : 'public/images/weather/03d.png', 
    '04n' : 'public/images/weather/04d.png',
    '09n' : 'public/images/weather/09d.png', 
    '10n' : 'public/images/weather/10d.png',
    '11n' : 'public/images/weather/11d.png', 
    '13n' : 'public/images/weather/13d.png',
    '50n' : 'public/images/weather/50d.png'
}
var iconImage;
var stuff = '';

// empty array for holding all the items that matches to the tags
var stuffToPack = {};


/*
    possible weathers:
    thunderstorm, drizzle, rain, snow, atmosphere (volcanic ashes, tornado), 
    clouds, extreme ( hail, tornado)
*/


////////////////// SOCKET IO CLIENT SIDE ////////////////////
// connects to the same page that the page was served from
var socket = io();

socket.on('connect', function(){
    console.log("connected");    
});


function getCurrentWeatherData(city){
    var myURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='
                + city + '&mode=json&units=imperial&cnt=12';
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

                var dateString = '<div class="dateDiv"'+ 'id="'+ unixDate +'">' + '<span class="dates">' + ourDate + '</span>' + '</a>' + ' ' + '<br>'+
                                   'max: ' + maxTemp + '<br>' +
                                   ' min: ' + minTemp + ' ' + '<br>' +
                                   iconImage + ' ' + '<br>' +
                                   weather + ' ' + '<br>' +
                                   stuff + '</div>';

                ///// ICON ////
                // looping through our icon object
                for ( var key in ourIcon){
                    // console.log(ourIcon[key]); // images/01d.png               
                    // if icon id is matched, display with our icons
                    if ( key === iconID ){
                        //console.log("we have matched one");
                        iconImage = '<img class="weather" src="' + ourIcon[key] + '">';
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
                    $('#dataPrint_top').append( '<div class="dateDiv"'+ 'id="'+ unixDate +'">' + '<span class="dates">' + ourDate + '</span>' + '</a>' + ' ' + '<br>'+
                                        'max: ' + maxTemp + '<br>' +
                                        ' min: ' + minTemp + ' ' + '<br>' +
                                        iconImage + ' ' + '<br>' +
                                        weather + ' ' + '<br>' +
                                        stuff + '</div>');
                } else {
                    $('#dataPrint_bottom').append( '<div class="dateDiv"'+ 'id="'+ unixDate +'">' + '<span class="dates">' + ourDate + '</span>' + '</a>' + ' ' + '<br>'+
                                        'max: ' + maxTemp + '<br>' +
                                        ' min: ' + minTemp + ' ' + '<br>' +
                                        iconImage + ' ' + '<br>' +
                                        weather + ' ' + '<br>' +
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

function getExistingData(){
    // first, need to see if it is an existing trip
    // we will check to see if a div with ID "slug" exists
    var slugDiv = document.getElementById('slug');
    if(slugDiv == null) return; // nothing to see here
    else{
        // let's get the data!
        var slug = slugDiv.getAttribute('data-slug');
        // console.log(slug);
        $.ajax({
            type: "GET",
            url: "/api/trip/"+slug,
            dataType: "json",
            success: function(response){
                stuffToPack = response;
                updateImages(stuffToPack);
            },
            failure: function(err){
                console.log(err)
            }
        })
        
    }
}

function loadStuffs(purposes){
    // console.log(myJsonStuff);
  
    // stuffToPack[purposes] = [];
    stuffToPack[purposes] = {};


    // looping through all stuffs
    for ( var item in myJsonStuff){
        // console.log(item); // utencil, raincoats
        var itemName = item;

        // if tags are matched with purposes  
        if ( _.contains(myJsonStuff[item].tags, purposes)) {
            // console.log(itemName);
            //stuffToPack[purposes].push(myJsonStuff[item]); 
            stuffToPack[purposes][itemName] = myJsonStuff[item]; 
        }
    }

    return stuffToPack;
}

var arrayForImages;


function updateImages(stuffToPack){
    arrayForImages = [];
    console.log(stuffToPack);
    console.log("showing images function");
    // need to update buttons
    
    // first, clear the div
    $('#bagRight').empty();
    // $('#itemList').empty();
    for ( var purpose in stuffToPack){
        // for ( var i = 0; i < stuffToPack[purpose].length; i++){

        for ( var item in stuffToPack[purpose]){            
            var image = stuffToPack[purpose][item].url;

            // get rid of duplicated one and put it into imageURL array
            arrayForImages.push(image);
            var imageURL = _.uniq(arrayForImages);

        }
    }

    // // get size of the bagRight
    // var bagwidth = $('#bagRight').width();
    // var bagheight = $('#bagRight').height();
    // console.log("the size of bag: " + bagwidth + ":" + bagheight);

    // loop through imageURL array and append to the #bagRight so that it has only one image
    for ( var i = 0; i < imageURL.length; i++){
        // we'll keep this because we spent 20min :) 
        var regex1 = /(images\/\objects\/|\/.png)/gi;
        var regex2 = /\.png/gi;
        var id = (imageURL[i].split(regex1)[2]).split(regex2)[0];

        $('#bagRight').prepend('<img class="items" id="' + id + '" src="' + imageURL[i] + '">');
        // $('#itemList').append('<div class="items small"><img id="' + id + '" src="' + imageURL[i] + '"></div>');
        // $(id).addClass('small');

        // //get IMAGE SIZSE SO THAT WE CAN FIT INTO BAGS
        // var img = document.getElementById(id); 
        // // when image is loaded - get width, height 
        // $(img).load(function(){
        //     var imgWidth = this.offsetWidth;
        //     var imgHeight = this.offsetHeight;
            
        //     console.log(imgWidth + ", " + imgHeight);

        //     drawDivs(bagwidth, bagheight, imgWidth, imgHeight);
        // });

    }


    

    // draggable?
    // $('.items').draggable();
    $(".items").draggable({ revert: "invalid"})
        .on("mousedown", function (event) {
            $(".items").droppable('enable');
    });


    $( "#bagRight" ).droppable({
        hoverClass: "over",
        drop: function( event, ui ) {
        $( this )
          // .css( "background-color", 'red' );
        }
    });


    $( "#recyclingBin" ).droppable({
        hoverClass: "over",
        drop: function( event, ui ) {
        $( this )
          // .css( "background-color", 'yellow' );

          // **** how can we grab id that we are clicking right now??
          var idToRemove = ui.draggable.context.id;
          $('#' + idToRemove).fadeOut();
          // remove idToRemove from stuffToPack]
          console.log(stuffToPack);
          //delete stuffToPack[tagg][idToRemove];
          //socket.emit('SendStuffToPack', stuffToPack);
          //$('.items').css('visibility', 'hidden');
        }

    });
 
    // get this from server

}



socket.on('stuffFromServer', function(stuffFromServer){
    // console.log("stuff from server: " + stuffFromServer);
    //updateImages now
    updateImages(stuffFromServer);

});

// slug from server
socket.on('slug', function(data){
    // console.log("sluuug " + data);
    addSlug(data);
});


// let users know their slug
function addSlug(ourSlug){
    //socket.emit("wantSlug", " please");
   if ( ourSlug !== undefined){
        console.log(ourSlug);
        $('#displaySlug').html('http://packingtogether.herokuapp.com/' + ourSlug);
        // $('#purposesWrap').append('<a href="http://packingtogether.herokuapp.com/' + ourSlug + '">' 
        //                 + '<div class="purposes" id="displaySlug">Your DataBase</div>'
        //                 + '</a>');

    } else {
        console.log("it is undefined");
    }

}


var myJsonStuff = {};
var gotJSON = false;
function dealWithResults(data){
    //do all stuff with results here;
    // console.log(data);
    myJsonStuff = data;
    gotJSON = true;
}

var checkListName;
function getCheckList(){
    $('#checkListContent').empty();
    $('#yourCheckList').html('Your Checklist');
    checkListName = $('#checkListName').val();


    for ( var tripPurpose in stuffToPack){
        console.log(stuffToPack[tripPurpose]);
        var items = stuffToPack[tripPurpose];
        for ( var item in items ){
            console.log(items[item].name);
            $('#checkListContent').append('<div class="content"><img class="checkboxes" src="public/images/UI/checkBox01.png"><span class="itemText">'+
                                            items[item].name + 
                                            '</span></div>');
        }
    }
    $('#yourCheckList').html(checkListName);
}


$('#getCheckList').click(function(){
    getCheckList();
});


// function popup(){
//     //Get the HTML of div
//     var divElements = document.getElementById(divID).innerHTML;
//     //Get the HTML of whole page
//     var oldPage = document.body.innerHTML;

//     //Reset the page's HTML with div's HTML only
//     document.body.innerHTML = 
//       "<html><head><title></title></head><body>" + 
//       divElements + "</body>";

//     //Print Page
//     window.print();
//     window.close();

// }

///////// PRINT FUNCTION 
function printDiv(divID) {
    //Get the HTML of div
    var divElements = document.getElementById(divID).innerHTML;
    //Get the HTML of whole page
    var oldPage = document.body.innerHTML;

    //Reset the page's HTML with div's HTML only
    document.body.innerHTML = 
      "<html><head><title></title></head><body>" + 
      divElements + "</body>";

    //Print Page
    window.print();

    //Restore orignal HTML
    document.body.innerHTML = oldPage;

  
}

$('#print').click(function(){
    // PrintElem('#checkList');
    printDiv('checkList');
    Popup($(elem).html());
});

//when save button is clicked, call event to save to db
$('#save').click(function(){
    console.log('saving to db! >> ' + stuffToPack);

    var slugDiv = document.getElementById('slug');
    if(slugDiv == null){
        // slug doesn't exist, so we need to save it
        socket.emit('saveData',stuffToPack);
    }
    else{
        // it exists already, so update it
        var slug = slugDiv.getAttribute('data-slug');
        console.log(slug);
        var dataToUpdate = {
            slug: slug,
            stuffToPack: stuffToPack
        }
        socket.emit('updateData', dataToUpdate);  
    }

    $('#displaySlug').css('visibility', 'visible');   
});




function clickbutton (tagg){
    console.log("click button function");
    $("#"+tagg).toggle(
        function () {
            $(this).css({"background-color":"#eeeeee"});
            purposes[tagg] = true;
            console.log( purposes[tagg]); // true
            if(purposes[tagg] == true) {
                // console.log("true");

                // load json file
                if(gotJSON){
                    //do stuff
                    // console.log(myJsonStuff);
                    loadStuffs(tagg);
                    // socket event to send stuffToPack data
                   // updateImages(stuffToPack);
                    console.log(stuffToPack);
                    socket.emit('SendStuffToPack', stuffToPack);
                }
                else{
                    console.log("json not loaded");
                }

            } 
        },
        function () {

            $(this).css({"background-color":"white"});
            purposes[tagg] = false;

            // remove from object if we clicked button again 
            delete stuffToPack[tagg];
            // socket event to send stuffToPack data
            console.log(stuffToPack);
           // updateImages(stuffToPack);

            socket.emit('SendStuffToPack', stuffToPack);

    });

}


$(document).ready(function(){
    //see if it an existing trip and get data
    getExistingData();

    $.getJSON( "public/js/stuff.json", dealWithResults);
    

    // $("#itemList").mouseenter(function(){
    //     console.log('enter');
    //     $(this).data('clicked', true);
    //     mouseThere = true;
    //     console.log(scrolling);
    // }).mouseleave(function(){
    //     console.log("leave");
    //     console.log(scrolling);
    // });
 

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
    $("#city").focus(function(){
        $(this).css("background-color", "#e1e1e1");
        $(this).css('border-bottom', '1.2px solid white');
        $(this).css("outline", "none"); // remove bounding box
    });

    $("#tripName").focus(function(){
        $(this).css("background-color", "RGBA(254, 237, 176, 1)");
        $(this).css('border-bottom', '1.2px solid white');
        $(this).css("outline", "none"); // remove bounding box
    });

    $('#searchWeather').click(function(){
        // when users clicked the button-- opaques the images

        $('#indication').css('visibility', 'visible');
        // empty the div first
        $('#dataPrint_top').html('');
        $('#dataPrint_bottom').html('');

        // get the city value from inputs
        var city = $('#city').val();
        console.log(city);

        // get weather API data
        getCurrentWeatherData(city);
    }).focus(function(){ $(this).blur(); });


    ////////// SECTION 2 ////////// 
    /// all the tags button    
    clickbutton('business');
    clickbutton('skiing');
    clickbutton('swimming');
    clickbutton('camping');

    $(".purposes").focus(function(){
        $(this).blur();
    });

    $("#getCheckList").focus(function(){
        $(this).blur();
    });

    $('#itemLits').mouseover(function(){
        $(this).css('overflow-y', 'scroll');
    });

});