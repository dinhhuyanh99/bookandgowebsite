document.addEventListener('DOMContentLoaded', function(){
	cloudinary.setCloudName("dhuyanh99");
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
			if(localStorage.getItem("accountType") == null || localStorage.getItem("accountType") == undefined || localStorage.getItem("accountType") == ""){
				var UserReq = new XMLHttpRequest();
				UserReq.open("GET", "https://bookandgo-api.herokuapp.com/user", false);
				UserReq.setRequestHeader("Content-Type", "application/json");
				UserReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
				UserReq.onreadystatechange = function(){
					if(this.readyState == 4 && this.status == 200){
						var returnedData = JSON.parse(this.responseText);
						localStorage.setItem("accountType", returnedData.userDetails.accountType);
					} else if(this.readyState == 4 && this.status == 500){
						M.toast({
							html: "<span>Error retrieving user's accountType. Returning to homepage...</span>",
							classes: "rounded",
							displayLength: 2000,
							completeCallback: function(){
								location.href = "../index.html";
							}
						});
					} else if(this.readyState == 4 && this.status == 401){
						M.toast({
							html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
							classes: "rounded",
							displayLength: 2000,
							completeCallback: function(){
								location.href = "../index.html";
							}
						});
					}
				};
				UserReq.send();
				if(localStorage.getItem("accountType") != 1){
					// document.querySelectorAll(".admin-users-list-details")[0].remove();
					var eventRequestsListWrapper = document.querySelectorAll(".requests-wrapper")[0];
					var EventReq = new XMLHttpRequest();
					var requestDetailsHTML = "";
					EventReq.open("GET", "https://bookandgo-api.herokuapp.com/requests", false);
					EventReq.setRequestHeader("Content-Type", "application/json");
					EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
					EventReq.onreadystatechange = function(){
						if(this.readyState == 4 && this.status == 200){
							var returnedReqsList = JSON.parse(this.responseText);
							if(returnedReqsList.length == 0){
								requestDetailsHTML += "<h5>You have no requests yet!🤕</h5>";
							} else {
								for(var i = 0; i < returnedReqsList.length; i++){
									requestDetailsHTML += "<div class=\"row\">";
									requestDetailsHTML += "<div class=\"col s12 m8\">";
									requestDetailsHTML += "<h6 class=\"event-title\">" + returnedReqsList.results[i].event.name + "</h6>";
									requestDetailsHTML += "<span><strong>Location: </strong>" + returnedReqsList.results[i].event.location + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.ticketType == 0){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>General Admission</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 1){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>VIP</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 2){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Reserved</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 3){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Multiday-pass</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 4){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Oneday-pass</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>Price/Ticket: </strong>$" + returnedReqsList.results[i].event.price + "</span>";
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Start Time: </strong>" + new Date(returnedReqsList.results[i].event.startTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>End Time: </strong>" + new Date(returnedReqsList.results[i].event.endTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<br/>";
									if(returnedReqsList.results[i].status == -1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Rejected</span>";
									} else if(returnedReqsList.results[i].status == 0){
										requestDetailsHTML += "<span><strong>Request status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].status == 1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Accepted</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Deleted/Rejected</span>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<span><strong>Event status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Active</span>";
									} 
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Request's Reason: </strong>" + returnedReqsList.results[i].reason + "</span>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "<div class=\"col s12 m4\">";
									requestDetailsHTML += "<span><strong>Requested Time: </strong>" + new Date(returnedReqsList.results[i].createdAt).toUTCString() + "</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedReqsList.results[i].event._id + "\">See Event Details</a>";
									} 
									requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" onclick=\"modifyEventTrigger('" + returnedReqsList.results[i].event._id + "', '" + returnedReqsList.results[i]._id + "')\">Modify Event</a>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "</div>";
								}

							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user's requests list. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						} else if(this.readyState == 4 && this.status == 401){
							M.toast({
								html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						}
					};
					EventReq.send();
					eventRequestsListWrapper.children[1].remove();
					eventRequestsListWrapper.innerHTML += requestDetailsHTML;
				} else {
					// document.querySelectorAll(".admin-users-list-details")[0].remove();
					var eventRequestsListWrapper = document.querySelectorAll(".requests-wrapper")[0];
					var EventReq = new XMLHttpRequest();
					var requestDetailsHTML = "";
					EventReq.open("GET", "https://bookandgo-api.herokuapp.com/admin/events", false);
					EventReq.setRequestHeader("Content-Type", "application/json");
					EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
					EventReq.onreadystatechange = function(){
						if(this.readyState == 4 && this.status == 200){
							var returnedReqsList = JSON.parse(this.responseText);
							if(returnedReqsList.length == 0){
								requestDetailsHTML += "<h5>You have no requests yet!🤕</h5>";
							} else {
								for(var i = 0; i < returnedReqsList.length; i++){
									requestDetailsHTML += "<div class=\"row\">";
									requestDetailsHTML += "<div class=\"col s12 m8\">";
									requestDetailsHTML += "<h6 class=\"event-title\">" + returnedReqsList.results[i].event.name + "</h6>";
									requestDetailsHTML += "<span><strong>Location: </strong>" + returnedReqsList.results[i].event.location + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.ticketType == 0){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>General Admission</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 1){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>VIP</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 2){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Reserved</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 3){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Multiday-pass</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 4){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Oneday-pass</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>Price/Ticket: </strong>$" + returnedReqsList.results[i].event.price + "</span>";
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Start Time: </strong>" + new Date(returnedReqsList.results[i].event.startTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>End Time: </strong>" + new Date(returnedReqsList.results[i].event.endTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<br/>";
									if(returnedReqsList.results[i].status == -1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Rejected</span>";
									} else if(returnedReqsList.results[i].status == 0){
										requestDetailsHTML += "<span><strong>Request status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].status == 1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Accepted</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Deleted/Rejected</span>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<span><strong>Event status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Active</span>";
									} 
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Request's Reason: </strong>" + returnedReqsList.results[i].reason + "</span>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "<div class=\"col s12 m4\">";
									requestDetailsHTML += "<span><strong>Requested Time: </strong>" + new Date(returnedReqsList.results[i].createdAt).toUTCString() + "</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green disabled\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red disabled\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green\" onclick=\"acceptEventRequest('" + returnedReqsList.results[i].event._id + "')\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red\" onclick=\"rejectEventRequest('" + returnedReqsList.results[i].event._id + "')\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green disabled\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red disabled\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedReqsList.results[i].event._id + "\">See Event Details</a>";
									} 
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "</div>";
								}

							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user's requests list. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						} else if(this.readyState == 4 && this.status == 401){
							M.toast({
								html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						}
					};
					EventReq.send();
					eventRequestsListWrapper.children[1].remove();
					eventRequestsListWrapper.innerHTML += requestDetailsHTML;
				}
			} else {
				if(localStorage.getItem("accountType") != 1){
					// document.querySelectorAll(".admin-users-list-details")[0].remove();
					var eventRequestsListWrapper = document.querySelectorAll(".requests-wrapper")[0];
					var EventReq = new XMLHttpRequest();
					var requestDetailsHTML = "";
					EventReq.open("GET", "https://bookandgo-api.herokuapp.com/requests", false);
					EventReq.setRequestHeader("Content-Type", "application/json");
					EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
					EventReq.onreadystatechange = function(){
						if(this.readyState == 4 && this.status == 200){
							var returnedReqsList = JSON.parse(this.responseText);
							if(returnedReqsList.length == 0){
								requestDetailsHTML += "<h5>You have no requests yet!🤕</h5>";
							} else {
								for(var i = 0; i < returnedReqsList.length; i++){
									requestDetailsHTML += "<div class=\"row\">";
									requestDetailsHTML += "<div class=\"col s12 m8\">";
									requestDetailsHTML += "<h6 class=\"event-title\">" + returnedReqsList.results[i].event.name + "</h6>";
									requestDetailsHTML += "<span><strong>Location: </strong>" + returnedReqsList.results[i].event.location + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.ticketType == 0){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>General Admission</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 1){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>VIP</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 2){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Reserved</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 3){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Multiday-pass</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 4){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Oneday-pass</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>Price/Ticket: </strong>$" + returnedReqsList.results[i].event.price + "</span>";
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Start Time: </strong>" + new Date(returnedReqsList.results[i].event.startTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>End Time: </strong>" + new Date(returnedReqsList.results[i].event.endTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<br/>";
									if(returnedReqsList.results[i].status == -1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Rejected</span>";
									} else if(returnedReqsList.results[i].status == 0){
										requestDetailsHTML += "<span><strong>Request status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].status == 1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Accepted</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Deleted/Rejected</span>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<span><strong>Event status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Active</span>";
									} 
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Request's Reason: </strong>" + returnedReqsList.results[i].reason + "</span>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "<div class=\"col s12 m4\">";
									requestDetailsHTML += "<span><strong>Requested Time: </strong>" + new Date(returnedReqsList.results[i].createdAt).toUTCString() + "</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedReqsList.results[i].event._id + "\">See Event Details</a>";
									} 
									requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" onclick=\"modifyEventTrigger('" + returnedReqsList.results[i].event._id + "', '" + returnedReqsList.results[i]._id + "')\">Modify Event</a>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "</div>";
								}

							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user's requests list. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						} else if(this.readyState == 4 && this.status == 401){
							M.toast({
								html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						}
					};
					EventReq.send();
					eventRequestsListWrapper.children[1].remove();
					eventRequestsListWrapper.innerHTML += requestDetailsHTML;
				} else {
					// document.querySelectorAll(".admin-users-list-details")[0].remove();
					var eventRequestsListWrapper = document.querySelectorAll(".requests-wrapper")[0];
					var EventReq = new XMLHttpRequest();
					var requestDetailsHTML = "";
					EventReq.open("GET", "https://bookandgo-api.herokuapp.com/admin/events", false);
					EventReq.setRequestHeader("Content-Type", "application/json");
					EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
					EventReq.onreadystatechange = function(){
						if(this.readyState == 4 && this.status == 200){
							var returnedReqsList = JSON.parse(this.responseText);
							if(returnedReqsList.length == 0){
								requestDetailsHTML += "<h5>You have no requests yet!🤕</h5>";
							} else {
								for(var i = 0; i < returnedReqsList.length; i++){
									requestDetailsHTML += "<div class=\"row\">";
									requestDetailsHTML += "<div class=\"col s12 m8\">";
									requestDetailsHTML += "<h6 class=\"event-title\">" + returnedReqsList.results[i].event.name + "</h6>";
									requestDetailsHTML += "<span><strong>Location: </strong>" + returnedReqsList.results[i].event.location + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.ticketType == 0){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>General Admission</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 1){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>VIP</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 2){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Reserved</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 3){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Multiday-pass</span>";
									} else if(returnedReqsList.results[i].event.ticketType == 4){
										requestDetailsHTML += "<span><strong>Ticket Type: </strong>Oneday-pass</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>Price/Ticket: </strong>$" + returnedReqsList.results[i].event.price + "</span>";
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Start Time: </strong>" + new Date(returnedReqsList.results[i].event.startTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<span><strong>End Time: </strong>" + new Date(returnedReqsList.results[i].event.endTime).toUTCString() + "</span>";
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									requestDetailsHTML += "<br/>";
									if(returnedReqsList.results[i].status == -1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Rejected</span>";
									} else if(returnedReqsList.results[i].status == 0){
										requestDetailsHTML += "<span><strong>Request status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].status == 1){
										requestDetailsHTML += "<span><strong>Request status: </strong>Accepted</span>";
									}
									requestDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Deleted/Rejected</span>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<span><strong>Event status: </strong>Pending</span>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<span><strong>Event status: </strong>Active</span>";
									} 
									requestDetailsHTML += "<br/>";
									requestDetailsHTML += "<span><strong>Request's Reason: </strong>" + returnedReqsList.results[i].reason + "</span>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "<div class=\"col s12 m4\">";
									requestDetailsHTML += "<span><strong>Requested Time: </strong>" + new Date(returnedReqsList.results[i].createdAt).toUTCString() + "</span>";
									if(returnedReqsList.results[i].event.status == -1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green disabled\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red disabled\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 0){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green\" onclick=\"acceptEventRequest('" + returnedReqsList.results[i].event._id + "')\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red\" onclick=\"rejectEventRequest('" + returnedReqsList.results[i].event._id + "')\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue disabled\">See Event Details</a>";
									} else if(returnedReqsList.results[i].event.status == 1){
										requestDetailsHTML += "<a class=\"btn-outlined uow-green disabled\">Accept Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-red disabled\">Reject Request</a>";
										requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedReqsList.results[i].event._id + "\">See Event Details</a>";
									} 
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "</div>";
								}

							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user's requests list. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						} else if(this.readyState == 4 && this.status == 401){
							M.toast({
								html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
								classes: "rounded",
								displayLength: 2000,
								completeCallback: function(){
									location.href = "../index.html";
								}
							});
						}
					};
					EventReq.send();
					eventRequestsListWrapper.children[1].remove();
					eventRequestsListWrapper.innerHTML += requestDetailsHTML;
				}
			}
			
			
		}
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
});

function acceptEventRequest(requestID){
	var EventReq = new XMLHttpRequest();
	EventReq.open("PUT", "https://bookandgo-api.herokuapp.com/admin/events?modify_mode=approve_event_request&event_id=" + requestID, true);
	EventReq.setRequestHeader("Content-Type", "application/json");
	EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	EventReq.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Event Approved! Refreshing...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		} else if(this.readyState == 4 && this.status == 401){
			M.toast({
				html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 404){
			M.toast({
				html: "<span>Sorry but we cannot find any event with such ID...</span>",
				classes: "rounded",
				displayLength: 2000
			});
		} else if(this.readyState == 4 && this.status == 411){
			M.toast({
				html: "<span>Event ID missing... Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Invalid event_id. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		}
	};
	EventReq.send();
}
function rejectEventRequest(requestID){
	var EventReq = new XMLHttpRequest();
	EventReq.open("PUT", "https://bookandgo-api.herokuapp.com/admin/events?modify_mode=reject_event_request&event_id=" + requestID, true);
	EventReq.setRequestHeader("Content-Type", "application/json");
	EventReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	EventReq.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Event Approved! Refreshing...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		} else if(this.readyState == 4 && this.status == 401){
			M.toast({
				html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 404){
			M.toast({
				html: "<span>Sorry but we cannot find any event with such ID...</span>",
				classes: "rounded",
				displayLength: 2000
			});
		} else if(this.readyState == 4 && this.status == 411){
			M.toast({
				html: "<span>Event ID missing... Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Invalid event_id. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		}
	};
	EventReq.send();
}

function createEventTrigger(){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var modalHTML = "";
	modalHTML += "<div id=\"create-event-modal\"class=\"modal modal-fixed-footer\">";
	modalHTML += "<div class=\"modal-content\">";
	modalHTML += "<h4>Create New Event</h4>";
		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"eventName\" id=\"eventNameBox\">";
				modalHTML += "<label for=\"eventNameBox\">Event Name</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"location\" id=\"locationBox\">";
				modalHTML += "<label for=\"locationBox\">Location</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"startTime\" id=\"startTimeBox\" placeholder=\"Format: YYYY-MM-DDTHH:MM:SS.000Z\">";
				modalHTML += "<label for=\"startTimeBox\">Start Time</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"endTime\" id=\"endTimeBox\" placeholder=\"Format: YYYY-MM-DDTHH:MM:SS.000Z\">";
				modalHTML += "<label for=\"endTimeBox\">End Time</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";
		
		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"description\" id=\"descriptionBox\">";
				modalHTML += "<label for=\"descriptionBox\">Description</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"number\" name=\"price\" id=\"priceBox\">";
				modalHTML += "<label for=\"priceBox\">Price</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
			modalHTML += "<select>";
				modalHTML += "<option value=\"\" disabled selected>Choose your option</option>";
				modalHTML += "<option value=\"0\">General Admission</option>";
				modalHTML += "<option value=\"1\">VIP</option>";
				modalHTML += "<option value=\"2\">Reserved</option>";
				modalHTML += "<option value=\"3\">Multiday-pass</option>";
				modalHTML += "<option value=\"4\">Oneday-pass</option>";
			modalHTML += "</select>";
			modalHTML += "<label>Ticket Type</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s8 m10\">";
				modalHTML += "<input type=\"text\" name=\"thumbnail\" id=\"thumbnailBox\">";
				modalHTML += "<label for=\"thumbnailBox\">Thumbnail</label>";
			modalHTML += "</div>";
			modalHTML += "<div class=\"input-field col s4 m2\">";
				modalHTML += "<a class=\"btn-outlined uow-green\" onclick=\"uploadImage();\">Upload</a>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"number\" name=\"numberOfTickets\" id=\"numberOfTicketsBox\">";
				modalHTML += "<label for=\"numberOfTicketsBox\">Number Of Tickets</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"promoCodes\" id=\"promoCodesBox\" placeholder=\"Format: promocode^YYYY-MM-DD^discountFactor, ...\">";
				modalHTML += "<label for=\"promoCodesBox\">Promo Codes</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"number\" name=\"capacity\" id=\"capacityBox\">";
				modalHTML += "<label for=\"capacityBox\">Capacity</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

		modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
			modalHTML += "<div class=\"input-field col s12\">";
				modalHTML += "<input type=\"text\" name=\"reason\" id=\"reasonBox\" placeholder=\"Tell us briefly why you want to hold this event\">";
				modalHTML += "<label for=\"reasonBox\">Reason</label>";
			modalHTML += "</div>";
		modalHTML += "</div>";

	modalHTML += "</div>";
	modalHTML += "<div class=\"modal-footer\">";
	modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
	modalHTML += "<a class=\"waves-effect waves-green btn-flat\" onclick=\"createNewEvent();\">Create Event</a>";
	modalHTML += "</div>";
	modalHTML += "</div>";
	mainBody.innerHTML += modalHTML;
	var modalVar = document.getElementById("create-event-modal");
	var selectVar = document.querySelectorAll("select")[0];
	M.FormSelect.init(selectVar);
	M.updateTextFields();
	var createEventInstance = M.Modal.init(modalVar, {
		'onCloseEnd': function(){
			modalVar.remove();
		}
	});
	createEventInstance.open()
}

function createNewEvent(){
	var eventNameString = document.getElementById("eventNameBox").value;
	var locationString = document.getElementById("locationBox").value;
	var startTimeString = document.getElementById("startTimeBox").value;
	if(new Date(startTimeString) == "Invalid Date"){
		M.toast({
			html: "<span>Invalid Start Time format. Try checking it again</span>",
			classes: "rounded",
			displayLength: 2000
		});
		return -1;
	}
	var endTimeString = document.getElementById("endTimeBox").value;
	if(new Date(endTimeString) == "Invalid Date"){
		M.toast({
			html: "<span>Invalid End Time format. Try checking it again</span>",
			classes: "rounded",
			displayLength: 2000
		});
		return -1;
	}
	var descriptionString = document.getElementById("descriptionBox").value;
	var priceString = parseInt(document.getElementById("priceBox").value);
	var ticketTypeString = parseInt(M.FormSelect.init(document.querySelectorAll("select")[0]).getSelectedValues()[0]);
	var thumbnailString = document.getElementById("thumbnailBox").value;
	var numberOfTicketsString = parseInt(document.getElementById("numberOfTicketsBox").value);
	var promoCodesArray = [];
	if(document.getElementById("promoCodesBox").value != ""){
		var promoCodesStringSplited = document.getElementById("promoCodesBox").value.split(",");
		for(var index = 0; index < promoCodesStringSplited.length; index++){
			var promoCodeAtrbs = promoCodesStringSplited[index].split("^")
			var newPromoCode = {
				code: promoCodeAtrbs[0],
				validUntil: promoCodeAtrbs[1],
				discountFactor: parseInt(promoCodeAtrbs[2])
			}
			promoCodesArray.push(newPromoCode);
		}
	}
	var capacityString = parseInt(document.getElementById("capacityBox").value);
	var reasonString = document.getElementById("reasonBox").value;
	
	if(eventNameString == "" || eventNameString == undefined || eventNameString == null || 
		locationString == "" || locationString == undefined || locationString == null || 
		startTimeString == "" || startTimeString == undefined || startTimeString == null || 
		endTimeString == "" || endTimeString == undefined || endTimeString == null || 
		descriptionString == "" || descriptionString == undefined || descriptionString == null || 
		(priceString <= 0 || priceString == NaN) ||
		(ticketTypeString < 0 || ticketTypeString > 4|| ticketTypeString == NaN) ||
		thumbnailString == "" || thumbnailString == undefined || thumbnailString == null || 
		(numberOfTicketsString <= 0) || 
		(capacityString <= 0) || 
		reasonString == "" || reasonString == undefined || reasonString == null){

		M.toast({
			html: "<span>Please fill all of the details!</span>",
			classes: "rounded",
			displayLength: 2000
		});
		return -1;
	} else {
		var newDetails = {
			name: eventNameString,
			location: locationString,
			startTime: new Date(startTimeString),
			endTime: new Date(endTimeString),
			thumbnail: thumbnailString,
			price: priceString,
			ticketType: ticketTypeString,
			numberOfTickets: numberOfTicketsString,
			capacity: capacityString,
			description: descriptionString,
			promoCodes: promoCodesArray,
			reason: reasonString
		};

		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://bookandgo-api.herokuapp.com/events", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				M.toast({
					html: "<span>Added Event! Refreshing...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.reload();
					}
				});
			} else if(this.readyState == 4 && this.status == 401){
				M.toast({
					html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.href = "../index.html";
					}
				});
			} else if(this.readyState == 4 && this.status == 500){
				M.toast({
					html: "<span>Invalid event_id or user_id. Try logging in again! Returning to homepage...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.href = "../index.html";
					}
				});
			} 
		}
		xhttp.send(JSON.stringify(newDetails));
	}
}

function modifyEventTrigger(eventID, requestID){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://bookandgo-api.herokuapp.com/requests?request_id=" + requestID, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var responseTextParsed = JSON.parse(this.responseText);
			var returnedData = responseTextParsed.result;
			var modalHTML = "";
			modalHTML += "<div id=\"modify-event-modal\"class=\"modal modal-fixed-footer\">";
			modalHTML += "<div class=\"modal-content\">";
			modalHTML += "<h4>Modify Event Details</h4>";
				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"eventName\" id=\"eventNameBox\" value=\"" + returnedData.event.name + "\">";
						modalHTML += "<label for=\"eventNameBox\">Event Name</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"location\" id=\"locationBox\" value=\"" + returnedData.event.location + "\">";
						modalHTML += "<label for=\"locationBox\">Location</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"startTime\" id=\"startTimeBox\" placeholder=\"Format: YYYY-MM-DDTHH:MM:SS.000Z\" value=\"" + returnedData.event.startTime + "\">";
						modalHTML += "<label for=\"startTimeBox\">Start Time</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"endTime\" id=\"endTimeBox\" placeholder=\"Format: YYYY-MM-DDTHH:MM:SS.000Z\" value=\"" + returnedData.event.endTime + "\">";
						modalHTML += "<label for=\"endTimeBox\">End Time</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";
				
				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"description\" id=\"descriptionBox\" value=\"" + returnedData.event.description + "\">";
						modalHTML += "<label for=\"descriptionBox\">Description</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"number\" name=\"price\" id=\"priceBox\" value=\"" + returnedData.event.price + "\">";
						modalHTML += "<label for=\"priceBox\">Price</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
					modalHTML += "<select>";
					if(returnedData.event.ticketType == 0){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\" selected>General Admission</option>";
						modalHTML += "<option value=\"1\">VIP</option>";
						modalHTML += "<option value=\"2\">Reserved</option>";
						modalHTML += "<option value=\"3\">Multiday-pass</option>";
						modalHTML += "<option value=\"4\">Oneday-pass</option>";
					} else if(returnedData.event.ticketType == 1){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">General Admission</option>";
						modalHTML += "<option value=\"1\" selected>VIP</option>";
						modalHTML += "<option value=\"2\">Reserved</option>";
						modalHTML += "<option value=\"3\">Multiday-pass</option>";
						modalHTML += "<option value=\"4\">Oneday-pass</option>";
					} else if(returnedData.event.ticketType == 2){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">General Admission</option>";
						modalHTML += "<option value=\"1\">VIP</option>";
						modalHTML += "<option value=\"2\" selected>Reserved</option>";
						modalHTML += "<option value=\"3\">Multiday-pass</option>";
						modalHTML += "<option value=\"4\">Oneday-pass</option>";
					} else if(returnedData.event.ticketType == 3){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">General Admission</option>";
						modalHTML += "<option value=\"1\">VIP</option>";
						modalHTML += "<option value=\"2\">Reserved</option>";
						modalHTML += "<option value=\"3\" selected>Multiday-pass</option>";
						modalHTML += "<option value=\"4\">Oneday-pass</option>";
					} else if(returnedData.event.ticketType == 4){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">General Admission</option>";
						modalHTML += "<option value=\"1\">VIP</option>";
						modalHTML += "<option value=\"2\">Reserved</option>";
						modalHTML += "<option value=\"3\">Multiday-pass</option>";
						modalHTML += "<option value=\"4\" selected>Oneday-pass</option>";
					}
					modalHTML += "</select>";
					modalHTML += "<label>Ticket Type</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s8 m10\">";
						modalHTML += "<input type=\"text\" name=\"thumbnail\" id=\"thumbnailBox\" value=\"" + returnedData.event.thumbnail + "\">";
						modalHTML += "<label for=\"thumbnailBox\">Thumbnail</label>";
					modalHTML += "</div>";
					modalHTML += "<div class=\"input-field col s4 m2\">";
						modalHTML += "<a class=\"btn-outlined uow-green\" onclick=\"uploadImage();\">Upload</a>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"number\" name=\"numberOfTickets\" id=\"numberOfTicketsBox\" value=\"" + returnedData.event.numberOfTickets + "\">";
						modalHTML += "<label for=\"numberOfTicketsBox\">Number Of Tickets</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						if(returnedData.event.promoCodes.length == 0){
							modalHTML += "<input type=\"text\" name=\"promoCodes\" id=\"promoCodesBox\" placeholder=\"Format: promocode^YYYY-MM-DD^discountFactor, ...\">";
						} else {
							var promoCodeString = "";
							for(var i = 0; i < returnedData.event.promoCodes.length; i++){
								promoCodeString += returnedData.event.promoCodes[i].code + "^";
								promoCodeString += new Date(returnedData.event.promoCodes[i].validUntil).getFullYear() + "-";
								promoCodeString += (new Date(returnedData.event.promoCodes[i].validUntil).getMonth() + 1) + "-";
								promoCodeString += new Date(returnedData.event.promoCodes[i].validUntil).getDate()+ "^";
								promoCodeString += returnedData.event.promoCodes[i].discountFactor;
								if(i < (returnedData.event.promoCodes.length - 1)){
									promoCodeString += ",";
								}
							}
							modalHTML += "<input type=\"text\" name=\"promoCodes\" id=\"promoCodesBox\" placeholder=\"Format: promocode^YYYY-MM-DD^discountFactor, ...\" value=\"" + promoCodeString + "\">";
						}
						modalHTML += "<label for=\"promoCodesBox\">Promo Codes</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"number\" name=\"capacity\" id=\"capacityBox\" value=\"" + returnedData.event.capacity + "\">";
						modalHTML += "<label for=\"capacityBox\">Capacity</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

			if(returnedData.status == 0){
				modalHTML += "<a class=\"btn-outlined uow-red\">Delete Request</a>";
				modalHTML += "<span style=\"color: red;\">&nbsp;Careful as this will delete the request and the event!</span>";
			}
			modalHTML += "</div>";
			modalHTML += "<div class=\"modal-footer\">";
			modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
			if(returnedData.event.status == 1){
				modalHTML += "<a class=\"waves-effect waves-red btn-flat\" onclick=\"deleteEvent('" + eventID + "');\">Delete Event</a>";
			}
			modalHTML += "<a class=\"waves-effect waves-green btn-flat\" onclick=\"modifyEvent('" + eventID + "');\">Update Details</a>";
			modalHTML += "</div>";
			modalHTML += "</div>";
			mainBody.innerHTML += modalHTML;
			var modalVar = document.getElementById("modify-event-modal");
			var selectVar = document.querySelectorAll("select")[0];
			M.FormSelect.init(selectVar);
			M.updateTextFields();
			var modifyEventInstance = M.Modal.init(modalVar, {
				'onCloseEnd': function(){
					modalVar.remove();
				}
			});
			modifyEventInstance.open();
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Error retrieving event details. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 401){
			M.toast({
				html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		}
	};
	xhttp.send();
}

function deleteEvent(eventID){
	var xhttp = new XMLHttpRequest();
	xhttp.open("DELETE", "https://bookandgo-api.herokuapp.com/events?mode=single&event_id=" + eventID, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Deleted Event! Refreshing...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		} else if(this.readyState == 4 && this.status == 401){
			M.toast({
				html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 411){
			M.toast({
				html: "<span>event_id not provided! Try checking for your details in the URL!</span>",
				classes: "rounded",
				displayLength: 2000
			});
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Invalid event_id or user_id. Try logging in again! Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} 
	}
	xhttp.send();
}

function modifyEvent(eventID){
	var eventNameString = document.getElementById("eventNameBox").value;
	var locationString = document.getElementById("locationBox").value;
	var startTimeString = document.getElementById("startTimeBox").value;
	if(new Date(startTimeString) == "Invalid Date"){
		M.toast({
			html: "<span>Invalid Start Time format. Try checking it again</span>",
			classes: "rounded",
			displayLength: 2000
		});
		return -1;
	}
	var endTimeString = document.getElementById("endTimeBox").value;
	if(new Date(endTimeString) == "Invalid Date"){
		M.toast({
			html: "<span>Invalid End Time format. Try checking it again</span>",
			classes: "rounded",
			displayLength: 2000
		});
		return -1;
	}
	var descriptionString = document.getElementById("descriptionBox").value;
	var priceString = parseInt(document.getElementById("priceBox").value);
	var ticketTypeString = parseInt(M.FormSelect.init(document.querySelectorAll("select")[0]).getSelectedValues()[0]);
	var thumbnailString = document.getElementById("thumbnailBox").value;
	var numberOfTicketsString = parseInt(document.getElementById("numberOfTicketsBox").value);
	var promoCodesArray = [];
	if(document.getElementById("promoCodesBox").value != ""){
		var promoCodesStringSplited = document.getElementById("promoCodesBox").value.split(",");
		for(var index = 0; index < promoCodesStringSplited.length; index++){
			var promoCodeAtrbs = promoCodesStringSplited[index].split("^")
			var newPromoCode = {
				code: promoCodeAtrbs[0],
				validUntil: promoCodeAtrbs[1],
				discountFactor: parseInt(promoCodeAtrbs[2])
			}
			promoCodesArray.push(newPromoCode);
		}
	}
	var capacityString = parseInt(document.getElementById("capacityBox").value);
	
	var updatedDetails = {
		name: eventNameString,
		location: locationString,
		startTime: new Date(startTimeString),
		endTime: new Date(endTimeString),
		thumbnail: thumbnailString,
		price: priceString,
		ticketType: ticketTypeString,
		numberOfTickets: numberOfTicketsString,
		capacity: capacityString,
		description: descriptionString,
		promoCodes: promoCodesArray
	};

	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", "https://bookandgo-api.herokuapp.com/events?event_id=" + eventID, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Updated Event Details! Refreshing...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.reload();
				}
			});
		} else if(this.readyState == 4 && this.status == 401){
			M.toast({
				html: "<span>Unauthorized access! API Key is invalid. Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 404){
			M.toast({
				html: "<span>event_id not found! Try checking for your details in the URL!</span>",
				classes: "rounded",
				displayLength: 2000
			});
		} else if(this.readyState == 4 && this.status == 411){
			M.toast({
				html: "<span>event_id not provided! Try checking for your details in the URL!</span>",
				classes: "rounded",
				displayLength: 2000
			});
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Invalid event_id or user_id. Try logging in again! Returning to homepage...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} 
	}
	xhttp.send(JSON.stringify(updatedDetails));
}

function uploadImage(){
	var widget = cloudinary.openUploadWidget({ 
	cloudName: "dhuyanh99", uploadPreset: "rc8yuffu" }, (error, result) => {
		if(result && result.event === "success"){
			document.getElementById("thumbnailBox").value = result.info.secure_url;
			M.updateTextFields();
		}
	});
}
