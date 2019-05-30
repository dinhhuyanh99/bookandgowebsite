document.addEventListener('DOMContentLoaded', function(){
	if(typeof(Storage) !== "undefined"){
		if(localStorage.getItem("Api-Key") == undefined || localStorage.getItem("Api-Key") == "" || localStorage.getItem("Api-Key") == null){
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events/no_auth", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
						xhttp.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					var returnedData = JSON.parse(this.responseText);
					var carouselWrapper = document.querySelectorAll(".carousel")[0];
					var carouselPreloader = document.getElementById("main-events-display-preload");
					var otherEventsContainer = document.querySelectorAll(".container")[0];
					if(returnedData.length == 0){
						carouselWrapper.style.display = "none";
						carouselPreloader.style.display = "none";
						var mainEventsDisplay = document.querySelectorAll(".main-events-display")[0];
						mainEventsDisplay.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000; \">It feels empty in here...</h4>";
						mainEventsDisplay.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle;\">Mmmm... Go ahead and <a href=\"pages/register.html\">register</a>/<a href=\"#login-modal\" class=\"modal-trigger\">login</a>!</h4>";
					} else {
						if(returnedData.length >= 3){
							for(var i = 0; i < 3; i++){
								var newCarouselItem = "";
								if(i == 0){
									newCarouselItem += "<div class=\"carousel-item uow-red darken white-text\" href=\"#one!\">";
								} else if(i == 1){
									newCarouselItem += "<div class=\"carousel-item uow-green white-text\" href=\"#two!\">";
								} else if(i == 2){
									newCarouselItem += "<div class=\"carousel-item uow-blue lighten white-text\" href=\"#three!\">";
								}
								newCarouselItem += "<h2>" + returnedData.results[i].name + "</h2>";
								newCarouselItem += "<p class=\"white-text\">" + returnedData.results[i].description + "</p>";
								newCarouselItem += "<a href=\"#login-modal\" class=\"btn-outlined white-text waves-effect waves-light waves-ripple modal-trigger\">Apply Now</a>";
								newCarouselItem += "</div>";
								carouselWrapper.innerHTML += newCarouselItem;
							}
							if((returnedData.length - 3) <= 0){
								otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">We are out of events... 😅</h4>";
								otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Maybe your event shall appear here if you <a href=\"pages/register.html\">register</a>/<a href=\"#login-modal\" class=\"modal-trigger\">login</a> 🙈</h4>";
							} else {
								otherEventsContainer.innerHTML += "<h4>Other events</h4>";
								var colCounter = 0;
								var otherEventsString = "";
								for(var i = 3; i < returnedData.length; i++){
									otherEventsString += "<div class=\"col s12 m4\">";
									otherEventsString += "	<div class=\"card materialize-blue-grey darken-3\">";
									otherEventsString += "		<div class=\"card-content white-text\">";
									otherEventsString += "			<span class=\"card-title\">" + returnedData.results[i].name + "</span>";
									otherEventsString += "			<p>" + returnedData.results[i].description + "</p>";
									otherEventsString += "		</div>";
									otherEventsString += "		<div class=\"card-action\">";
									otherEventsString += "			<a href=\"#login-modal\" class=\"modal-trigger\">See details</a>";
									otherEventsString += "		</div>";
									otherEventsString += "	</div>";
									otherEventsString += "</div>";
									colCounter++;
									if((colCounter % 3) == 0){
										otherEventsString += "</div>";
										otherEventsString += "<div class=\"row\">";
									}
								}
								otherEventsContainer.innerHTML += "<div class=\"row\">" + otherEventsString + "</div>";
							}
						} else {
							for(var i = 0; i < returnedData.length; i++){
								var newCarouselItem = "";
								if(i == 0){
									newCarouselItem += "<div class=\"carousel-item uow-red darken white-text\" href=\"#one!\">";
								} else if(i == 1){
									newCarouselItem += "<div class=\"carousel-item uow-green white-text\" href=\"#two!\">";
								} else if(i == 2){
									newCarouselItem += "<div class=\"carousel-item uow-blue lighten white-text\" href=\"#three!\">";
								}
								newCarouselItem += "<h2>" + returnedData.results[i].name + "</h2>";
								newCarouselItem += "<p class=\"white-text\">" + returnedData.results[i].description + "</p>";
								newCarouselItem += "<a href=\"#login-modal\" class=\"btn-outlined white-text waves-effect waves-light waves-ripple modal-trigger\">Apply Now</a>";
								newCarouselItem += "</div>";
								carouselWrapper.innerHTML += newCarouselItem;
							}
							otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">We are out of events... 😅</h4>";
							otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Maybe your event shall appear here if you <a href=\"pages/register.html\">register</a>/<a href=\"#login-modal\" class=\"modal-trigger\">login</a> 🙈</h4>";
						}
						carouselPreloader.style.display = "none";
						M.Carousel.init(carouselWrapper, {
							'duration' : 200,
							'fullWidth': true,
							'indicators': true
						});
						var carouselInstance = M.Carousel.getInstance(carouselWrapper);
						setInterval(function(){
							carouselInstance.next();
						}, 10000);
					}
				}
			};

			xhttp.send();
		} else {
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
			xhttp.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					var returnedData = JSON.parse(this.responseText);
					var carouselWrapper = document.querySelectorAll(".carousel")[0];
					var carouselPreloader = document.getElementById("main-events-display-preload");
					var otherEventsContainer = document.querySelectorAll(".container")[0];
					if(returnedData.length == 0){
						carouselWrapper.style.display = "none";
						carouselPreloader.style.display = "none";
						var mainEventsDisplay = document.querySelectorAll(".main-events-display")[0];
						mainEventsDisplay.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000; \">It feels empty in here...</h4>";
						mainEventsDisplay.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle;\">Mmmm...</h4>";
						mainEventsDisplay.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000;\">Try adding something from Manage tab? 🤔</h4>";
					} else {
						if(returnedData.length >= 3){
							for(var i = 0; i < 3; i++){
								var newCarouselItem = "";
								if(i == 0){
									newCarouselItem += "<div class=\"carousel-item uow-red darken white-text\" href=\"#one!\">";
								} else if(i == 1){
									newCarouselItem += "<div class=\"carousel-item uow-green white-text\" href=\"#two!\">";
								} else if(i == 2){
									newCarouselItem += "<div class=\"carousel-item uow-blue lighten white-text\" href=\"#three!\">";
								}
								newCarouselItem += "<h2>" + returnedData.results[i].name + "</h2>";
								newCarouselItem += "<p class=\"white-text\">" + returnedData.results[i].description + "</p>";
								newCarouselItem += "<a href=\"pages/eventDetails.html?event_id=" + returnedData.results[i]._id + "\" class=\"btn-outlined white-text waves-effect waves-light waves-ripple\">Apply Now</a>";
								newCarouselItem += "</div>";
								carouselWrapper.innerHTML += newCarouselItem;
							}
							if((returnedData.length - 3) <= 0){
								otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">We are out of events... 😅</h4>";
								otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Maybe your event shall appear here if you post it 🙈</h4>";
								otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Go to <a style=\"cursor: pointer;\" onclick=\"alert('yeet');\">Manage</a> page now 🥳</h4>";
							} else {
								otherEventsContainer.innerHTML += "<h4>Other events</h4>";
								var colCounter = 0;
								var otherEventsString = "";
								for(var i = 3; i < returnedData.length; i++){
									otherEventsString += "<div class=\"col s12 m4\">";
									otherEventsString += "	<div class=\"card materialize-blue-grey darken-3\">";
									otherEventsString += "		<div class=\"card-content white-text\">";
									otherEventsString += "			<span class=\"card-title\">" + returnedData.results[i].name + "</span>";
									otherEventsString += "			<p>" + returnedData.results[i].description + "</p>";
									otherEventsString += "		</div>";
									otherEventsString += "		<div class=\"card-action\">";
									otherEventsString += "			<a href=\"pages/eventDetails.html?event_id=" + returnedData.results[i]._id + "\">See details</a>";
									otherEventsString += "		</div>";
									otherEventsString += "	</div>";
									otherEventsString += "</div>";
									colCounter++;
									if((colCounter % 3) == 0){
										otherEventsString += "</div>";
										otherEventsString += "<div class=\"row\">";
									}
								}
								otherEventsContainer.innerHTML += "<div class=\"row\">" + otherEventsString + "</div>";
							}
						} else {
							for(var i = 0; i < returnedData.length; i++){
								var newCarouselItem = "";
								if(i == 0){
									newCarouselItem += "<div class=\"carousel-item uow-red darken white-text\" href=\"#one!\">";
								} else if(i == 1){
									newCarouselItem += "<div class=\"carousel-item uow-green white-text\" href=\"#two!\">";
								} else if(i == 2){
									newCarouselItem += "<div class=\"carousel-item uow-blue lighten white-text\" href=\"#three!\">";
								}
								newCarouselItem += "<h2>" + returnedData.results[i].name + "</h2>";
								newCarouselItem += "<p class=\"white-text\">" + returnedData.results[i].description + "</p>";
								newCarouselItem += "<a href=\"\" class=\"btn-outlined white-text waves-effect waves-light waves-ripple\">Apply Now</a>";
								newCarouselItem += "</div>";
								carouselWrapper.innerHTML += newCarouselItem;
							}
							otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">We are out of events... 😅</h4>";
							otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Maybe your event shall appear here if you post it 🙈</h4>";
							otherEventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; \">Go to <a style=\"cursor: pointer;\" onclick=\"alert('yeet');\">Manage</a> page now 🥳</h4>";
						}
						carouselPreloader.style.display = "none";
						M.Carousel.init(carouselWrapper, {
							'duration' : 200,
							'fullWidth': true,
							'indicators': true
						});
						var carouselInstance = M.Carousel.getInstance(carouselWrapper);
						setInterval(function(){
							carouselInstance.next();
						}, 10000);
					}
				}
			};
			xhttp.send();
		}
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
});
