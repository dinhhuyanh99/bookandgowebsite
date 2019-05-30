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
			var eventsContainer = document.querySelectorAll(".container")[0];
			var eventsTable = document.querySelectorAll(".events-table")[0];
			var eventsMobileList = document.querySelectorAll(".events-mobile-list")[0];
			var containerLoadProgress = document.getElementById("container-load-progress");
			eventsTable.style.display = "none";
			eventsMobileList.style.display = "none";
			if(location.search == "" || location.search == null || location.search == undefined){
				var xhttp = new XMLHttpRequest();
				xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events", true);
				xhttp.setRequestHeader("Content-Type", "application/json");
				xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
				xhttp.onreadystatechange = function(){
					if(this.readyState == 4 && this.status == 200){
						var returnedData = JSON.parse(this.responseText);
						if(returnedData.length <= 0){
							containerLoadProgress.style.display = "none";
							eventsTable.style.display = "none";
							eventsMobileList.style.display = "none";
							eventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000; \">It feels empty in here...🥴</h4>";
						} else {
							var eventsTableHeader = document.querySelectorAll(".events-table-header")[0];
							var eventsTableBody = document.querySelectorAll(".events-table-body")[0];
							var eventsListOptions = document.querySelectorAll(".events-list-options")[0];
							var eventsListBody = document.querySelectorAll(".events-list-body")[0];
							var eventsTableHeaderHTML = "";
							var eventsTableBodyHTML = "";
							var eventsListOptionsHTML = "";
							var eventsListBodyHTML = "";
							eventsTableHeaderHTML += "<div class=\"row\">";
							eventsTableHeaderHTML += "<div class=\"col m6 l6 xl6 disabled\">";
							eventsTableHeaderHTML += "<h6><a>Event</a></h6>";
							eventsTableHeaderHTML += "</div>"
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2\">";
							eventsTableHeaderHTML += "<h6><a onclick=\"sortDateTime();\">Date/Time</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2\">";
							eventsTableHeaderHTML += "<h6><a onclick=\"sortPrice();\">Price</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2 disabled\">";
							eventsTableHeaderHTML += "<h6><a>Options</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "</div>";
							eventsListOptionsHTML += "<div class=\"row\">";
							eventsListOptionsHTML += "<div class=\"input-field col xs6 s6 m5\">";
							eventsListOptionsHTML += "<select name=\"mobileSortBy\" id=\"mobileSortByBox\">";
							eventsListOptionsHTML += "<option value=\"\" disabled selected>Choose your option</option>";
							eventsListOptionsHTML += "<option value=\"priceAsc\">Price Ascending</option>";
							eventsListOptionsHTML += "<option value=\"priceDesc\">Price Descending</option>";
							eventsListOptionsHTML += "<option value=\"startSoonest\">Start Soonest</option>";
							eventsListOptionsHTML += "<option value=\"startLatest\">Start Latest</option>";
							eventsListOptionsHTML += "</select>"
							eventsListOptionsHTML += "<label for=\"mobileSortBy\">Sort By</label>";
							eventsListOptionsHTML += "</div>";
							eventsListOptionsHTML += "<div class=\"col xs3 s3 m3\">";
							eventsListOptionsHTML += "<a class=\"btn-outlined uow-blue\" onclick=\"sortDataMobile();\">Sort</a>";
							eventsListOptionsHTML += "</div>";
							eventsListOptionsHTML += "</div>";
							for(var i = 0; i < returnedData.length; i++){
								eventsTableBodyHTML += "<div class=\"row\">";
								eventsTableBodyHTML += "<div class=\"col m6 l6 xl6\">";
								eventsTableBodyHTML += "<img class=\"event-thumbnail\" src=\"" + returnedData.results[i].thumbnail + "\" alt=\"" + returnedData.results[i]._id + "\">";
								eventsTableBodyHTML += "<h5 class=\"event-title\" ><a href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">" + returnedData.results[i].name + "</a></h5>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<h6><span>" + new Date(returnedData.results[i].startTime).getHours() + ":" + new Date(returnedData.results[i].startTime).getMinutes() + "</span></h6>";
								eventsTableBodyHTML += "<h6><span>" + new Date(returnedData.results[i].startTime).toDateString() + "</h6>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<h6><a>$" + returnedData.results[i].price + "</a></h6>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<a class=\"btn-outlined uow-green\" onclick=\"bookForEventTrigger('" + returnedData.results[i]._id + "');\">Book Ticket</a>";
								eventsTableBodyHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">See Details</a>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "</div>";
								eventsListBodyHTML += "<div class=\"row\">";
								eventsListBodyHTML += "<div class=\"col xs12 s12 m8\">";
								eventsListBodyHTML += "<img class=\"event-thumbnail\" src=\"" + returnedData.results[i].thumbnail + "\" alt=\"" + returnedData.results[i]._id + "\">";
								eventsListBodyHTML += "<a class=\"event-title\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">" + returnedData.results[i].name + "</a>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "<div class=\"col xs12 s12 m4\">";
								eventsListBodyHTML += "<span><strong>Start time: </strong>" + new Date(returnedData.results[i].startTime).getHours() + ":" + new Date(returnedData.results[i].startTime).getMinutes() + "</span>";
								eventsListBodyHTML += "<span><strong>Date: </strong>" + new Date(returnedData.results[i].startTime).toDateString() + "</span>";
								eventsListBodyHTML += "<span><strong>Price: $</strong>" + returnedData.results[i].price + "</span>";
								eventsListBodyHTML += "<div class=\"events-action-buttons\">";
								eventsListBodyHTML += "<a class=\"btn-outlined uow-green\" onclick=\"bookForEventTrigger('" + returnedData.results[i]._id + "');\">Book Ticket</a>";
								eventsListBodyHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">See Details</a>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "</div>";
							}
							eventsTableHeader.innerHTML += eventsTableHeaderHTML;
							eventsTableBody.innerHTML += eventsTableBodyHTML;
							eventsListOptions.innerHTML += eventsListOptionsHTML;
							M.FormSelect.init(document.querySelectorAll("select"));
							eventsListBody.innerHTML += eventsListBodyHTML;
							containerLoadProgress.style.display = "none";
							eventsTable.style.display = "";
							eventsMobileList.style.display = "";
						}
					}
				};
				xhttp.send();
			} else {
				var xhttp = new XMLHttpRequest();
				xhttp.open("GET", "https://bookandgo-api.herokuapp.com/events" + location.search, true);
				xhttp.setRequestHeader("Content-Type", "application/json");
				xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
				xhttp.onreadystatechange = function(){
					if(this.readyState == 4 && this.status == 200){
						var returnedData = JSON.parse(this.responseText);
						if(returnedData.length <= 0){
							containerLoadProgress.style.display = "none";
							eventsTable.style.display = "none";
							eventsMobileList.style.display = "none";
							eventsContainer.innerHTML += "<h4 style=\"text-align: center; vertical-align: middle; color:#008000; \">It feels empty in here...🥴</h4>";
						} else {
							var eventsTableHeader = document.querySelectorAll(".events-table-header")[0];
							var eventsTableBody = document.querySelectorAll(".events-table-body")[0];
							var eventsListOptions = document.querySelectorAll(".events-list-options")[0];
							var eventsListBody = document.querySelectorAll(".events-list-body")[0];
							var eventsTableHeaderHTML = "";
							var eventsTableBodyHTML = "";
							var eventsListOptionsHTML = "";
							var eventsListBodyHTML = "";
							if(location.search == "?sort_by=priceAsc"){
								eventsTableHeaderHTML += "<span>Sorted with Price in Ascending Order</span>";
							} else if(location.search == "?sort_by=priceDesc"){
								eventsTableHeaderHTML += "<span>Sorted with Price in Descending Order</span>";
							} else if(location.search == "?sort_by=startSoonest"){
								eventsTableHeaderHTML += "<span>Sorted with Events that start the soonest first</span>";
							} else if(location.search == "?sort_by=startLatest"){
								eventsTableHeaderHTML += "<span>Sorted with Events that start the latest first</span>";
							}
							eventsTableHeaderHTML += "<div class=\"row\">";
							eventsTableHeaderHTML += "<div class=\"col m6 l6 xl6 disabled\">";
							eventsTableHeaderHTML += "<h6><a>Event</a></h6>";
							eventsTableHeaderHTML += "</div>"
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2\">";
							eventsTableHeaderHTML += "<h6><a onclick=\"sortDateTime();\">Date/Time</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2\">";
							eventsTableHeaderHTML += "<h6><a onclick=\"sortPrice();\">Price</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "<div class=\"col m2 l2 xl2 disabled\">";
							eventsTableHeaderHTML += "<h6><a>Options</a></h6>";
							eventsTableHeaderHTML += "</div>";
							eventsTableHeaderHTML += "</div>";
							eventsListOptionsHTML += "<div class=\"row\">";
							eventsListOptionsHTML += "<div class=\"input-field col xs6 s6 m5\">";
							eventsListOptionsHTML += "<select name=\"mobileSortBy\" id=\"mobileSortByBox\">";
							if(location.search == "?sort_by=priceAsc"){
								eventsListOptionsHTML += "<option value=\"\" disabled>Choose your option</option>";
								eventsListOptionsHTML += "<option value=\"priceAsc\" selected>Price Ascending</option>";
								eventsListOptionsHTML += "<option value=\"priceDesc\">Price Descending</option>";
								eventsListOptionsHTML += "<option value=\"startSoonest\">Start Soonest</option>";
								eventsListOptionsHTML += "<option value=\"startLatest\">Start Latest</option>";
							} else if(location.search == "?sort_by=priceDesc"){
								eventsListOptionsHTML += "<option value=\"\" disabled>Choose your option</option>";
								eventsListOptionsHTML += "<option value=\"priceAsc\">Price Ascending</option>";
								eventsListOptionsHTML += "<option value=\"priceDesc\" selected>Price Descending</option>";
								eventsListOptionsHTML += "<option value=\"startSoonest\">Start Soonest</option>";
								eventsListOptionsHTML += "<option value=\"startLatest\">Start Latest</option>";
							} else if(location.search == "?sort_by=startSoonest"){
								eventsListOptionsHTML += "<option value=\"\" disabled>Choose your option</option>";
								eventsListOptionsHTML += "<option value=\"priceAsc\">Price Ascending</option>";
								eventsListOptionsHTML += "<option value=\"priceDesc\">Price Descending</option>";
								eventsListOptionsHTML += "<option value=\"startSoonest\" selected>Start Soonest</option>";
								eventsListOptionsHTML += "<option value=\"startLatest\">Start Latest</option>";
							} else if(location.search == "?sort_by=startLatest"){
								eventsListOptionsHTML += "<option value=\"\" disabled>Choose your option</option>";
								eventsListOptionsHTML += "<option value=\"priceAsc\">Price Ascending</option>";
								eventsListOptionsHTML += "<option value=\"priceDesc\">Price Descending</option>";
								eventsListOptionsHTML += "<option value=\"startSoonest\">Start Soonest</option>";
								eventsListOptionsHTML += "<option value=\"startLatest\" selected>Start Latest</option>";
							}
							
							eventsListOptionsHTML += "</select>"
							eventsListOptionsHTML += "<label for=\"mobileSortBy\">Sort By</label>";
							eventsListOptionsHTML += "</div>";
							eventsListOptionsHTML += "<div class=\"col xs3 s3 m3\">";
							eventsListOptionsHTML += "<a class=\"btn-outlined uow-blue\" onclick=\"sortDataMobile();\">Sort</a>";
							eventsListOptionsHTML += "</div>";
							eventsListOptionsHTML += "</div>";
							for(var i = 0; i < returnedData.length; i++){
								eventsTableBodyHTML += "<div class=\"row\">";
								eventsTableBodyHTML += "<div class=\"col m6 l6 xl6\">";
								eventsTableBodyHTML += "<img class=\"event-thumbnail\" src=\"" + returnedData.results[i].thumbnail + "\" alt=\"" + returnedData.results[i]._id + "\">";
								eventsTableBodyHTML += "<h5 class=\"event-title\" ><a href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">" + returnedData.results[i].name + "</a></h5>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<h6><span>" + new Date(returnedData.results[i].startTime).getHours() + ":" + new Date(returnedData.results[i].startTime).getMinutes() + "</span></h6>";
								eventsTableBodyHTML += "<h6><span>" + new Date(returnedData.results[i].startTime).toDateString() + "</h6>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<h6><a>$" + returnedData.results[i].price + "</a></h6>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "<div class=\"col m2 l2 xl2\">";
								eventsTableBodyHTML += "<a class=\"btn-outlined uow-green\" onclick=\"bookForEventTrigger('" + returnedData.results[i]._id + "');\">Book Ticket</a>";
								eventsTableBodyHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">See Details</a>";
								eventsTableBodyHTML += "</div>";
								eventsTableBodyHTML += "</div>";
								eventsListBodyHTML += "<div class=\"row\">";
								eventsListBodyHTML += "<div class=\"col xs12 s12 m8\">";
								eventsListBodyHTML += "<img class=\"event-thumbnail\" src=\"" + returnedData.results[i].thumbnail + "\" alt=\"" + returnedData.results[i]._id + "\">";
								eventsListBodyHTML += "<a class=\"event-title\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">" + returnedData.results[i].name + "</a>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "<div class=\"col xs12 s12 m4\">";
								eventsListBodyHTML += "<span><strong>Start time: </strong>" + new Date(returnedData.results[i].startTime).getHours() + ":" + new Date(returnedData.results[i].startTime).getMinutes() + "</span>";
								eventsListBodyHTML += "<span><strong>Date: </strong>" + new Date(returnedData.results[i].startTime).toDateString() + "</span>";
								eventsListBodyHTML += "<span><strong>Price: $</strong>" + returnedData.results[i].price + "</span>";
								eventsListBodyHTML += "<div class=\"events-action-buttons\">";
								eventsListBodyHTML += "<a class=\"btn-outlined uow-green\" onclick=\"bookForEventTrigger('" + returnedData.results[i]._id + "');\">Book Ticket</a>";
								eventsListBodyHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedData.results[i]._id + "\">See Details</a>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "</div>";
								eventsListBodyHTML += "</div>";
							}
							eventsTableHeader.innerHTML += eventsTableHeaderHTML;
							eventsTableBody.innerHTML += eventsTableBodyHTML;
							eventsListOptions.innerHTML += eventsListOptionsHTML;
							M.FormSelect.init(document.querySelectorAll("select"));
							eventsListBody.innerHTML += eventsListBodyHTML;
							containerLoadProgress.style.display = "none";
							eventsTable.style.display = "";
							eventsMobileList.style.display = "";
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

function sortDataMobile(){
	var currentSelect = document.querySelectorAll("select")[0];
	var instanceOfCurrentSelect = M.FormSelect.init(currentSelect);
	location.href = "events.html?sort_by=" + instanceOfCurrentSelect.getSelectedValues()[0];
}

function sortDateTime(){
	if(location.search == "" || location.search == null || location.search == undefined ||
		location.search == "?sort_by=startLatest" || location.search == "?sort_by=priceAsc" || location.search == "?sort_by=priceDesc"){
		location.href = "?sort_by=startSoonest";
	} else {
		location.href = "?sort_by=startLatest";
	}
}

function sortPrice(){
	if(location.search == "" || location.search == null || location.search == undefined ||
		location.search == "?sort_by=priceDesc" || location.search == "?sort_by=startLatest" || location.search == "?sort_by=startSoonest"){
		location.href = "?sort_by=priceAsc";
	} else {
		location.href = "?sort_by=priceDesc";
	}
}

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
					var eventsListOptions = document.querySelectorAll(".events-list-options")[0];
					eventsListOptions.children[0].children[0].remove;
					eventsListOptions.children[0].children[1].remove;
					var newSortBy = "";
					newSortBy += "<div class=\"input-field col xs6 s6 m5\">";
					newSortBy += "<select name=\"mobileSortBy\" id=\"mobileSortByBox\">";
					if(location.search == "?sort_by=priceAsc"){
						newSortBy += "<option value=\"\" disabled>Choose your option</option>";
						newSortBy += "<option value=\"priceAsc\" selected>Price Ascending</option>";
						newSortBy += "<option value=\"priceDesc\">Price Descending</option>";
						newSortBy += "<option value=\"startSoonest\">Start Soonest</option>";
						newSortBy += "<option value=\"startLatest\">Start Latest</option>";
					} else if(location.search == "?sort_by=priceDesc"){
						newSortBy += "<option value=\"\" disabled>Choose your option</option>";
						newSortBy += "<option value=\"priceAsc\">Price Ascending</option>";
						newSortBy += "<option value=\"priceDesc\" selected>Price Descending</option>";
						newSortBy += "<option value=\"startSoonest\">Start Soonest</option>";
						newSortBy += "<option value=\"startLatest\">Start Latest</option>";
					} else if(location.search == "?sort_by=startSoonest"){
						newSortBy += "<option value=\"\" disabled>Choose your option</option>";
						newSortBy += "<option value=\"priceAsc\">Price Ascending</option>";
						newSortBy += "<option value=\"priceDesc\">Price Descending</option>";
						newSortBy += "<option value=\"startSoonest\" selected>Start Soonest</option>";
						newSortBy += "<option value=\"startLatest\">Start Latest</option>";
					} else if(location.search == "?sort_by=startLatest"){
						newSortBy += "<option value=\"\" disabled>Choose your option</option>";
						newSortBy += "<option value=\"priceAsc\">Price Ascending</option>";
						newSortBy += "<option value=\"priceDesc\">Price Descending</option>";
						newSortBy += "<option value=\"startSoonest\">Start Soonest</option>";
						newSortBy += "<option value=\"startLatest\" selected>Start Latest</option>";
					} else if(location.search == ""){
						newSortBy += "<option value=\"\" disabled selected>Choose your option</option>";
						newSortBy += "<option value=\"priceAsc\">Price Ascending</option>";
						newSortBy += "<option value=\"priceDesc\">Price Descending</option>";
						newSortBy += "<option value=\"startSoonest\">Start Soonest</option>";
						newSortBy += "<option value=\"startLatest\">Start Latest</option>";
					}
					
					newSortBy += "</select>"
					newSortBy += "<label for=\"mobileSortBy\">Sort By</label>";
					newSortBy += "</div>";
					newSortBy += "<div class=\"col xs3 s3 m3\">";
					newSortBy += "<a class=\"btn-outlined uow-blue\" onclick=\"sortDataMobile();\">Sort</a>";
					newSortBy += "</div>";
					eventsListOptions.children[0].innerHTML = newSortBy;
					M.FormSelect.init(document.querySelectorAll("select"));
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
					var modalVar = document.getElementById(eventID);
					var modalVarInstance = M.Modal.getInstance(modalVar);
					modalVarInstance.close();
				}
			});
		} else if(this.readyState == 4 && (this.status == 404 || this.status == 411 || this.status == 500)){
			M.toast({
				html: "<span>Failed to book into event!</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					var modalVar = document.getElementById(eventID);
					var modalVarInstance = M.Modal.getInstance(modalVar);
					modalVarInstance.close();
				}
			});
		}
	}
	xhttp.send(JSON.stringify(bookingDetails));
}