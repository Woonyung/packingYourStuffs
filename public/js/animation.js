/*
 _  _     _                                      _   _           
| || |___| |_ __   _  _ ___ _  _   _ __  __ _ __| |_(_)_ _  __ _ 
| __ / -_) | '_ \ | || / _ \ || | | '_ \/ _` / _| / / | ' \/ _` |
|_||_\___|_| .__/  \_, \___/\_,_| | .__/\__,_\__|_\_\_|_||_\__, |
           |_|     |__/           |_|                      |___/

with Woon and Neva :)
javascript file for animation
*/


$(document).ready(function(){
	$('#titleDiv').each(function(){
		$(this).addClass("hatch");
	});
});

$(window).scroll(function() {
	$('#inputData').each(function(){
	var imagePos = $(this).offset().top;

	var topOfWindow = $(window).scrollTop();
		if (imagePos < topOfWindow+400) {
			$(this).addClass("slideUp");
		}
	});
});
