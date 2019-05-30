document.addEventListener('DOMContentLoaded', function(){
	if(typeof(Storage) !== "undefined"){
		if(localStorage.getItem("Api-Key") == undefined || localStorage.getItem("Api-Key") == "" || localStorage.getItem("Api-Key") == null){
			M.toast({
				html: "<span>Your session is invalid! Returning to homepage ...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else {
			var eventsSplash = document.querySelectorAll(".splash")[0];
			var eventsContainer = document.querySelectorAll(".container")[0];
			var mainBody = document.querySelectorAll(".main-body")[0];
			var mainBodyLoadProgress = document.getElementById("main-body-load-progress");
			eventsContainer.style.display = "none";
			eventsSplash.style.display = "none";
			mainBodyLoadProgress.style.display = "";
			if(location.search == "" || location.search == null || location.search == undefined){
				M.toast({
					html: "<span>Invalid event! Returning to events page...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.href = "events.html";
					}
				});
			} else {
				var xhttp = new XMLHttpRequest();
				xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events" + location.search, true);
				xhttp.setRequestHeader("Content-Type", "application/json");
				xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
				xhttp.onreadystatechange = function(){
					if(this.readyState == 4 && this.status == 200){
						var returnedData = JSON.parse(this.responseText);
						if(returnedData == null || returnedData == undefined){
							mainBody.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000; \">It feels empty in here...🥴</h4>";
							mainBodyLoadProgress.style.display = "none";
						} else {
							document.title = returnedData.event.name + " - Book'nGo";
							var eventsDetailsHeader = document.querySelectorAll(".events-details-header")[0];
							var eventsDetailsBody = document.querySelectorAll(".events-details-body")[0];
							var eventsSplashHTML = "";
							var eventsDetailsHeaderHTML = "";
							var eventsDetailsBodyHTML = "";
							eventsSplashHTML += "<h4>" + returnedData.event.name + "</h4>";
							eventsDetailsHeaderHTML += "";
							eventsDetailsHeaderHTML += "<div class=\"row\">";
							eventsDetailsHeaderHTML += "<div class=\"col xs12 s12 m12 l8 xl8\">";
							eventsDetailsHeaderHTML += "<div class=\"image-container\">";
							eventsDetailsHeaderHTML += "<img src=\"" + returnedData.event.thumbnail + "\" alt=\"" + returnedData.event._id + "\"/>";
							eventsDetailsHeaderHTML += "</div>";
							eventsDetailsHeaderHTML += "</div>";
							eventsDetailsHeaderHTML += "<div class=\"col xs12 s12 m12 l4 xl4\">";
							eventsDetailsHeaderHTML += "<span><strong>Price: </strong> $" + returnedData.event.price + "</span>";
							if(returnedData.event.promoCodes.length == 0){
								eventsDetailsHeaderHTML += "<spanclass=\"inactive\">";	
								eventsDetailsHeaderHTML += "<i class=\"material-icons\">loyalty</i><strong>Promocode not available 😔</strong></span>";
							} else {
								eventsDetailsHeaderHTML += "<span class=\"active\">";	
								eventsDetailsHeaderHTML += "<i class=\"material-icons\">loyalty</i><strong>Promocode available!</strong></span>";
							}
							eventsDetailsHeaderHTML += "<br/><span><strong>Tickets left: </strong>" + returnedData.event.numberOfTickets + "</span><br/>";
							eventsDetailsHeaderHTML += "<a class=\"btn-outlined uow-green\" onclick=\"bookForEventTrigger('" + returnedData.event._id + "');\">Book Ticket</a>";
							eventsDetailsHeaderHTML += "</div>";
							eventsDetailsHeaderHTML += "</div>";
							eventsDetailsBodyHTML += "<div class=\"row\">";
							eventsDetailsBodyHTML += "<div class=\"col s12\">";
							eventsDetailsBodyHTML += "<h4>Description</h4>";

							eventsDetailsBodyHTML += "<span><strong>Start Time: </strong>" + new Date(returnedData.event.startTime).toDateString() + ", " + new Date(returnedData.event.startTime).getHours() + ":" + new Date(returnedData.event.startTime).getMinutes() + "</span>";
							eventsDetailsBodyHTML += "<br/><span><strong>End Time: </strong>" + new Date(returnedData.event.endTime).toDateString() + ", " + new Date(returnedData.event.endTime).getHours() + ":" + new Date(returnedData.event.endTime).getMinutes() + "</span>";
							eventsDetailsBodyHTML += "<br/><span><strong>Location: </strong>" + returnedData.event.location + "</span>";
							eventsDetailsBodyHTML += "<br/><span><strong>Capacity: </strong>" + returnedData.event.capacity + "</span>";
							if(returnedData.event.ticketType == 0){
								eventsDetailsBodyHTML += "<br/><span><strong>Ticket Type: </strong>General Admission</span>";
							} else if(returnedData.event.ticketType == 1){
								eventsDetailsBodyHTML += "<br/><span><strong>Ticket Type: </strong>VIP</span>";
							} else if(returnedData.event.ticketType == 2){
								eventsDetailsBodyHTML += "<br/><span><strong>Ticket Type: </strong>Reserved</span>";
							} else if(returnedData.event.ticketType == 3){
								eventsDetailsBodyHTML += "<br/><span><strong>Ticket Type: </strong>Multiday-pass</span>";
							} else if(returnedData.event.ticketType == 4){
								eventsDetailsBodyHTML += "<br/><span><strong>Ticket Type: </strong>Oneday-pass</span>";
							}
							eventsDetailsBodyHTML += "<br/><p>" + returnedData.event.description + "</p>";
							eventsDetailsBodyHTML += "<br/><span><strong>Created at: </strong>" + new Date(returnedData.event.createdAt).toDateString() + ", " + new Date(returnedData.event.createdAt).getHours() + ":" + new Date(returnedData.event.createdAt).getMinutes() + "</span>";
							eventsDetailsBodyHTML += "</div>";
							eventsDetailsBodyHTML += "</div>";

							eventsSplash.innerHTML += eventsSplashHTML;
							eventsDetailsHeader.innerHTML += eventsDetailsHeaderHTML;
							eventsDetailsBody.innerHTML += eventsDetailsBodyHTML;

							mainBodyLoadProgress.style.display = "none";
							eventsContainer.style.display = "";
							eventsSplash.style.display = "";
						}
					}
				};
				xhttp.send();
			}
		}
	
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
	
});

function bookForEventTrigger(eventID){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var modalHTML = "";
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events?event_id=" + eventID, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var returnedData = JSON.parse(this.responseText);
			modalHTML += "<div id=\"" + eventID + "\"class=\"modal\">";
			modalHTML += "<div class=\"modal-content\">";
			modalHTML += "<h4>" + returnedData.event.name + "</h4>";
			modalHTML += "<p><strong>Description: </strong>" + returnedData.event.description + "</p>";
			modalHTML += "<p><strong>Number of tickets left: </strong>" + returnedData.event.numberOfTickets + "</p>";
			modalHTML += "<p><strong>Price: </strong>" + returnedData.event.price + "</p>";
			modalHTML += "<p><strong>Start time: </strong>" + new Date(returnedData.event.startTime).toDateString() + " " + new Date(returnedData.event.startTime).getHours() + ":" + new Date(returnedData.event.startTime).getMinutes() + "</p>";
			modalHTML += "<p><strong>End time: </strong>" + new Date(returnedData.event.endTime).toDateString() + " " + new Date(returnedData.event.endTime).getHours() + ":" + new Date(returnedData.event.endTime).getMinutes() + "</p>";
			modalHTML += "<div class=\"input-field\">";
			if(returnedData.event.promoCodes.length == 0){
	            modalHTML += "<input disabled id=\"promo-code\" type=\"text\" value=\"No promocodes available!\">";
			} else {
	            modalHTML += "<input id=\"promo-code\" type=\"text\">";
	            modalHTML += "<label for=\"promo-code\">Promo Code</label>";
			}
	        modalHTML += "</div>";
			modalHTML += "</div>";
			modalHTML += "<div class=\"modal-footer\">";
			modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
			modalHTML += "<a class=\"waves-effect waves-green btn-flat\" onclick=\"bookEvent('" + eventID + "');\">Book now</a>";
			modalHTML += "</div>";
			modalHTML += "</div>";
			mainBody.innerHTML += modalHTML;
			var modalVar = document.getElementById(eventID);
			var bookingModalInstance = M.Modal.init(modalVar, {
				'onCloseEnd': function(){
					modalVar.remove();
				}
			});
			bookingModalInstance.open();
		}
	}
	xhttp.send();	
}

function bookEvent(eventID){
	var promoCode = document.getElementById("promo-code");
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "https://bookandgo-api.herokuapp.com/booking", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	var bookingDetails = {
		"event_id": eventID,
		"promoCodeApplied": promoCode.value
	};
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Successful! Check your account details to pay!</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		} else if(this.readyState == 4 && (this.status == 404 || this.status == 411 || this.status == 500)){
			M.toast({
				html: "<span>Failed to book into event!</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		}
	}
	xhttp.send(JSON.stringify(bookingDetails));
}