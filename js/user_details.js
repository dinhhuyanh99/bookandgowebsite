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
			var userDetailsContainer = document.querySelectorAll(".container")[0];
			var userDetailsName = document.querySelectorAll(".user-details-name")[0];
			var userDetailsBody = document.querySelectorAll(".user-details-body")[0];
			var personalDetails = document.querySelectorAll(".personal-details")[0];
			var activitiesTableBody = document.querySelectorAll(".activities-table-body")[0];
			var bookingsWrapper = document.querySelectorAll(".bookings-wrapper")[0];
			var requestsWrapper = document.querySelectorAll(".requests-wrapper")[0];
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "https://bookandgo-api.herokuapp.com/user", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
			xhttp.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					var returnedData = JSON.parse(this.responseText);
					var personalDetailsHTML = "";
					var activitiesTableBodyHTML = "";
					var bookingDetailsHTML = "";
					var requestDetailsHTML = "";
					/*Assign header name*/
					userDetailsName.innerHTML = returnedData.userDetails.firstName + " " + returnedData.userDetails.lastName;

					/*Assign personal details*/
					personalDetailsHTML += "<span><strong>Personal ID: </strong>" + returnedData.userDetails.personalID + "</span>";
					personalDetailsHTML += "<span><strong>Username: </strong>" + returnedData.userDetails.username + "</span>";
					personalDetailsHTML += "<br/>";
					personalDetailsHTML += "<span><strong>First Name: </strong>" + returnedData.userDetails.firstName + "</span>";
					personalDetailsHTML += "<span><strong>Last Name: </strong>" + returnedData.userDetails.lastName + "</span>";
					personalDetailsHTML += "<span><strong>Date Of Birth: </strong>" + new Date(returnedData.userDetails.dateOfBirth).toDateString() + "</span>";
					personalDetailsHTML += "<span><strong>Email: </strong>" + returnedData.userDetails.email + "</span>";
					personalDetailsHTML += "<span><strong>Phone Number: </strong>" + returnedData.userDetails.phoneNumber + "</span>";
					personalDetailsHTML += "<span style=\"max-width: 600px;	min-width: 200px;text-overflow: ellipsis;white-space: nowrap;display: block;overflow: hidden\"><strong>Address: </strong>" + returnedData.userDetails.address + "</span>";
					if(returnedData.userDetails.gender == 0){
						personalDetailsHTML += "<span><strong>Gender: </strong>Male</span>";
					} else if(returnedData.userDetails.gender == 1){
						personalDetailsHTML += "<span><strong>Gender: </strong>Female</span>";
					} else if(returnedData.userDetails.gender == 2){
						personalDetailsHTML += "<span><strong>Gender: </strong>Prefer not to say</span>";
					} 

					/*Assign activities logs*/
					if(returnedData.userDetails.activities.length == 0) {
						activitiesTableBodyHTML += "<h6>You have no activities yet!</h6>"
					} else {
						for(var i = 0; i < returnedData.userDetails.activities.length; i++){
							activitiesTableBodyHTML += "<div class=\"row\">";
							activitiesTableBodyHTML += "<div class=\"col s6\">";
							activitiesTableBodyHTML += "<span>" + returnedData.userDetails.activities[i].activityDescription + "</span>";
							activitiesTableBodyHTML += "</div>";
							activitiesTableBodyHTML += "<div class=\"col s6\">";
							activitiesTableBodyHTML += "<span>" + new Date(returnedData.userDetails.activities[i].timeOfActivtiy).toDateString() + "</span>";
							activitiesTableBodyHTML += "</div>";
							activitiesTableBodyHTML += "</div>";
						}
					}

					/*Assign booking details*/
					var bookingReq = new XMLHttpRequest();
					bookingReq.open("GET", "https://bookandgo-api.herokuapp.com/booking", false);
					bookingReq.setRequestHeader("Content-Type", "application/json");
					bookingReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
					bookingReq.onreadystatechange = function(){
						if(this.readyState == 4 && this.status == 200){
							var returnedBooking = JSON.parse(this.responseText);
							if(returnedBooking.length == 0){
								bookingDetailsHTML += "<h5>You have no bookings yet!🤕</h5>";
							} else {
								for(var i = 0; i < returnedBooking.length; i++){
									bookingDetailsHTML += "<div class=\"row\" id=\"" + returnedBooking.results[i]._id + "\">";
									bookingDetailsHTML += "<div class=\"col s12 m8\">";
									bookingDetailsHTML += "<h6 class=\"event-title\">" + returnedBooking.results[i].eventDetails.name + "</h6>";
									bookingDetailsHTML += "<span><strong>Location: </strong>" + returnedBooking.results[i].eventDetails.location + "</span>";
									bookingDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedBooking.results[i].eventDetails.ticketType == 0){
										bookingDetailsHTML += "<span><strong>Ticket Type: </strong>General Admission</span>";
									} else if(returnedBooking.results[i].eventDetails.ticketType == 1){
										bookingDetailsHTML += "<span><strong>Ticket Type: </strong>VIP</span>";
									} else if(returnedBooking.results[i].eventDetails.ticketType == 2){
										bookingDetailsHTML += "<span><strong>Ticket Type: </strong>Reserved</span>";
									} else if(returnedBooking.results[i].eventDetails.ticketType == 3){
										bookingDetailsHTML += "<span><strong>Ticket Type: </strong>Multiday-pass</span>";
									} else if(returnedBooking.results[i].eventDetails.ticketType == 4){
										bookingDetailsHTML += "<span><strong>Ticket Type: </strong>Oneday-pass</span>";
									}
									bookingDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									bookingDetailsHTML += "<span><strong>Paid: </strong>$" + returnedBooking.results[i].finalPrice + "</span>";
									bookingDetailsHTML += "<br/>";
									bookingDetailsHTML += "<span><strong>Start Time: </strong>" + new Date(returnedBooking.results[i].eventDetails.startTime).toUTCString() + "</span>";
									bookingDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									bookingDetailsHTML += "<span><strong>End Time: </strong>" + new Date(returnedBooking.results[i].eventDetails.endTime).toUTCString() + "</span>";
									bookingDetailsHTML += "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
									if(returnedBooking.results[i].promoCodeApplied == "" || returnedBooking.results[i].promoCodeApplied == null || returnedBooking.results[i].promoCodeApplied == undefined){
										bookingDetailsHTML += "<span><strong>Promo Code Applied: </strong>none</span>";
									} else {
										bookingDetailsHTML += "<span><strong>Promo Code Applied: </strong>" + returnedBooking.results[i].promoCodeApplied + "</span>";
									}
									bookingDetailsHTML += "</div>";
									bookingDetailsHTML += "<div class=\"col s12 m4\">";
									bookingDetailsHTML += "<span><strong>Booked Time: </strong>" + new Date(returnedBooking.results[i].createdAt).toUTCString() + "</span>";
									bookingDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedBooking.results[i].eventDetails._id + "\">See Event Details</a>";
									bookingDetailsHTML += "<a class=\"btn-outlined uow-red\" onclick=\"cancelBooking('" + returnedBooking.results[i]._id + "')\">Cancel Booking</a>";
									bookingDetailsHTML += "</div>";
									bookingDetailsHTML += "</div>";
								}
							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user details. Returning to homepage...</span>",
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
					bookingReq.send();

					/*Assign requests to HTML*/
					var EventReq = new XMLHttpRequest();
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
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "<div class=\"col s12 m4\">";
									requestDetailsHTML += "<span><strong>Requested Time: </strong>" + new Date(returnedReqsList.results[i].createdAt).toUTCString() + "</span>";
									// requestDetailsHTML += "<a class=\"btn-outlined uow-blue\" href=\"eventDetails.html?event_id=" + returnedReqsList.results[i].eventDetails._id + "\">See Event Details</a>";
									// requestDetailsHTML += "<a class=\"btn-outlined uow-red\" onclick=\"cancelBooking('" + returnedReqsList.results[i]._id + "')\">Delete Event</a>";
									requestDetailsHTML += "</div>";
									requestDetailsHTML += "</div>";
								}
							}
						} else if(this.readyState == 4 && this.status == 500){
							M.toast({
								html: "<span>Error retrieving user details. Returning to homepage...</span>",
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


					personalDetails.children[1].remove();
					activitiesTableBody.children[0].remove();
					bookingsWrapper.children[2].remove();
					requestsWrapper.children[1].remove();
					personalDetails.innerHTML += personalDetailsHTML;
					activitiesTableBody.innerHTML += activitiesTableBodyHTML;
					bookingsWrapper.innerHTML += bookingDetailsHTML;
					requestsWrapper.innerHTML += requestDetailsHTML;
				} else if(this.readyState == 4 && this.status == 500){
					M.toast({
						html: "<span>Error retrieving user details. Returning to homepage...</span>",
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
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
});

function cancelBooking(bookingID){
	var bookingReq = new XMLHttpRequest();
	bookingReq.open("DELETE", "https://bookandgo-api.herokuapp.com/booking?booking_id=" + bookingID, true);
	bookingReq.setRequestHeader("Content-Type", "application/json");
	bookingReq.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	bookingReq.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var returnedBooking = JSON.parse(this.responseText);
			M.toast({
				html: "<span>Successfully canceled booking! Updating...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					document.getElementById(bookingID).remove();
				}
			});
		}
	};
	bookingReq.send();
}

function editUserDetailsTrigger(){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://bookandgo-api.herokuapp.com/user", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var returnedData = JSON.parse(this.responseText);
			var modalHTML = "";
			modalHTML += "<div id=\"update-user-modal\"class=\"modal modal-fixed-footer\">";
			modalHTML += "<div class=\"modal-content\">";
			modalHTML += "<h4>Edit User Details</h4>";
				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"personalID\" id=\"personalIDBox\" value=\"" + returnedData.userDetails.personalID + "\">";
						modalHTML += "<label for=\"personalIDBox\">PersonalID (Optional)</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"email\" name=\"email\" id=\"emailBox\" value=\"" + returnedData.userDetails.email + "\">";
						modalHTML += "<label for=\"emailBox\">Email</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"phoneNumber\" id=\"phoneNumberBox\" value=\"" + returnedData.userDetails.phoneNumber + "\">";
						modalHTML += "<label for=\"phoneNumberBox\">Phone Number</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12 m6 l6 xl6\">";
						modalHTML += "<input type=\"text\" name=\"firstName\" id=\"firstNameBox\" value=\"" + returnedData.userDetails.firstName + "\">";
						modalHTML += "<label for=\"firstNameBox\">First Name</label>";
					modalHTML += "</div>";
					modalHTML += "<div class=\"input-field col s12 m6 l6 xl6\">";
						modalHTML += "<input type=\"text\" name=\"lastName\" id=\"lastNameBox\" value=\"" + returnedData.userDetails.lastName + "\">";
						modalHTML += "<label for=\"lastNameBox\">Last Name</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";
				
				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12 m4\">";
						modalHTML += "<input type=\"number\" name=\"user-dob-day\" id=\"user-dob-day\" min=\"1\" max=\"31\" value=\"" + new Date(returnedData.userDetails.dateOfBirth).getDate() + "\">";
						modalHTML += "<label for=\"user-dob-day\">Day of Birth</label>";
					modalHTML += "</div>";
					modalHTML += "<div class=\"input-field col s12 m4\">";
						modalHTML += "<input type=\"number\" name=\"user-dob-month\" id=\"user-dob-month\" min=\"1\" max=\"12\" value=\"" + (new Date(returnedData.userDetails.dateOfBirth).getMonth() + 1) + "\">";
						modalHTML += "<label for=\"user-dob-month\">Month of Birth</label>";
					modalHTML += "</div>";
					modalHTML += "<div class=\"input-field col s12 m4\">";
						modalHTML += "<input type=\"number\" name=\"user-dob-year\" id=\"user-dob-year\" min=\"1900\" max=\"2990\" value=\"" + new Date(returnedData.userDetails.dateOfBirth).getFullYear() + "\">";
						modalHTML += "<label for=\"user-dob-year\">Year of Birth</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
						modalHTML += "<input type=\"text\" name=\"address\" id=\"addressBox\" value=\"" + returnedData.userDetails.address + "\">";
						modalHTML += "<label for=\"addressBox\">Address</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				modalHTML += "<div class=\"row\" style=\"margin-bottom: 0px;\">";
					modalHTML += "<div class=\"input-field col s12\">";
					modalHTML += "<select>";
					if(returnedData.userDetails.gender == 0){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\" selected>Male</option>";
						modalHTML += "<option value=\"1\">Female</option>";
						modalHTML += "<option value=\"2\">Prefer not to say</option>";
					} else if(returnedData.userDetails.gender == 1){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">Male</option>";
						modalHTML += "<option value=\"1\" selected>Female</option>";
						modalHTML += "<option value=\"2\">Prefer not to say</option>";
					} else if(returnedData.userDetails.gender == 2){
						modalHTML += "<option value=\"\" disabled>Choose your option</option>";
						modalHTML += "<option value=\"0\">Male</option>";
						modalHTML += "<option value=\"1\">Female</option>";
						modalHTML += "<option value=\"2\" selected>Prefer not to say</option>";
					}
					modalHTML += "</select>";
					modalHTML += "<label>Gender</label>";
					modalHTML += "</div>";
				modalHTML += "</div>";

				
			modalHTML += "</div>";
			modalHTML += "<div class=\"modal-footer\">";
			modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
			modalHTML += "<a class=\"waves-effect waves-green btn-flat\" onclick=\"editUserDetails();\">Update Details</a>";
			modalHTML += "</div>";
			modalHTML += "</div>";
			mainBody.innerHTML += modalHTML;
			var modalVar = document.getElementById("update-user-modal");
			var selectVar = document.querySelectorAll("select")[0];
			M.FormSelect.init(selectVar);
			M.updateTextFields();
			var updateUserInstance = M.Modal.init(modalVar, {
				'onCloseEnd': function(){
					modalVar.remove();
				}
			});
			updateUserInstance.open();
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Error retrieving user details. Returning to homepage...</span>",
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

function editUserDetails(){
	var selectVar = document.querySelectorAll("select")[0];
	var personalIDString = document.getElementById("personalIDBox").value;
	var emailString = document.getElementById("emailBox").value;
	var phoneNumberString = document.getElementById("phoneNumberBox").value;
	var firstNameString = document.getElementById("firstNameBox").value;
	var lastNameString = document.getElementById("lastNameBox").value;
	var dateOfBirthString = "";
	if(document.getElementById("user-dob-year").value < 1900 || document.getElementById("user-dob-year").value > 2990 ||
		document.getElementById("user-dob-month").value < 1 || document.getElementById("user-dob-month").value > 12 ||
		document.getElementById("user-dob-day").value < 1 || document.getElementById("user-dob-day").value > 31){
		M.toast({
			html: "<span>Invalid Date Of Birth!</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else {
		dateOfBirthString = document.getElementById("user-dob-year").value + "-" + document.getElementById("user-dob-month").value + "-" + document.getElementById("user-dob-day").value;
	}
	var addressString = document.getElementById("addressBox").value;
	var currentSelectInstance = M.FormSelect.init(selectVar);
	var genderString = parseInt(currentSelectInstance.getSelectedValues()[0]);


	if(emailString == "" || emailString == null || emailString == undefined ||
		phoneNumberString == "" || phoneNumberString == null || phoneNumberString == undefined ||
		firstNameString == "" || firstNameString == null || firstNameString == undefined ||
		lastNameString == "" || lastNameString == null || lastNameString == undefined ||
		addressString == "" || addressString == null || addressString == undefined ||
		(genderString < 0 || genderString > 2)){
		M.toast({
			html: "<span>Please fill in all of the details!</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else {
		var userUpdatedDetails = {
			personalID: personalIDString,
			email: emailString,
			phoneNumber: phoneNumberString,
			firstName: firstNameString,
			lastName: lastNameString,
			dateOfBirth: new Date(dateOfBirthString),
			address: addressString,
			gender: genderString
		};
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "https://bookandgo-api.herokuapp.com/user", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				M.toast({
					html: "<span>Successfully updated account! Refreshing...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.reload()
					}
				});
			} else if(this.readyState == 4 && this.status == 500){
				M.toast({
					html: "<span>Error updating your details. Returning to homepage...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.href = "../index.html";
					}
				});
			}
		};
		xhttp.send(JSON.stringify(userUpdatedDetails));
	}
}

function changePasswordTrigger(){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var modalHTML = "";
	modalHTML += "<div id=\"change-password-modal\"class=\"modal\">";
	modalHTML += "<div class=\"modal-content\">";
	modalHTML += "<h4>Change Password</h4>";
	modalHTML += "<div class=\"row\">";
	modalHTML += "<div class=\"input-field\">";
	modalHTML += "<input id=\"password-new\" type=\"password\">";
	modalHTML += "<label for=\"password-new\">New Password</label>";
    modalHTML += "</div>";
    modalHTML += "<div class=\"input-field\">";
	modalHTML += "<input id=\"password-new-confirm\" type=\"password\">";
	modalHTML += "<label for=\"password-new-confirm\">New Password Confirm</label>";
    modalHTML += "</div>";
    modalHTML += "</div>";
	modalHTML += "</div>";
	modalHTML += "<div class=\"modal-footer\">";
	modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
	modalHTML += "<a class=\"waves-effect waves-green btn-flat\" onclick=\"changePassword();\">Change</a>";
	modalHTML += "</div>";
	modalHTML += "</div>";
	mainBody.innerHTML += modalHTML;
	var modalVar = document.getElementById("change-password-modal");
	var changePasswordInstance = M.Modal.init(modalVar, {
		'onCloseEnd': function(){
			modalVar.remove();
		}
	});
	changePasswordInstance.open();
}

function changePassword(){
	var newPassword = document.getElementById("password-new").value;
	var newPasswordConfirm = document.getElementById("password-new-confirm").value;
	if(newPassword != newPasswordConfirm){
		M.toast({
			html: "<span>Password doesn't match, check again? 🤔</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else if(newPassword == "" || newPasswordConfirm == ""){
		M.toast({
			html: "<span>You need to type in your password... 😐</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else {
		var xhttp = new XMLHttpRequest();
		var newPasswordWrapper = {
			password: newPassword
		};
		xhttp.open("PUT", "https://bookandgo-api.herokuapp.com/user?mode=change_password", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				M.toast({
					html: "<span>Successfully updated password! Refreshing...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.reload();
					}
				});
			} else if(this.readyState == 4 && this.status == 500){
				M.toast({
					html: "<span>Error updating user password. Returning to homepage...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						location.href = "../index.html";
					}
				});
			} else if(this.readyState == 4 && this.status == 411){
				M.toast({
					html: "<span>Invalid password sent.Try again?</span>",
					classes: "rounded",
					displayLength: 2000
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
		xhttp.send(JSON.stringify(newPasswordWrapper));
	}
}

function deactivateTrigger(){
	var mainBody = document.querySelectorAll(".main-body")[0];
	var modalHTML = "";
	modalHTML += "<div id=\"deactivation-modal\"class=\"modal\">";
	modalHTML += "<div class=\"modal-content\">";
	modalHTML += "<h4>Confirm deactivation</h4>";
	modalHTML += "<span>Are you sure about your decision? You have to contact the admin again to reactivate your account.</span>";
	modalHTML += "</div>";
	modalHTML += "<div class=\"modal-footer\">";
	modalHTML += "<a class=\"modal-close waves-effect waves-red btn-flat\">Cancel</a>";
	modalHTML += "<a class=\"waves-effect waves-red btn-flat\" onclick=\"deactivate();\">Deactivate</a>";
	modalHTML += "</div>";
	modalHTML += "</div>";
	mainBody.innerHTML += modalHTML;
	var modalVar = document.getElementById("deactivation-modal");
	var deactivateInstance = M.Modal.init(modalVar, {
		'onCloseEnd': function(){
			modalVar.remove();
		}
	});
	deactivateInstance.open();
}

function deactivate(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", "https://bookandgo-api.herokuapp.com/user?mode=deactivate", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			M.toast({
				html: "<span>Successfully deactivate account! Logging out...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					localStorage.removeItem("Api-Key");
					localStorage.removeItem("Api-Key-Expiration");
					localStorage.removeItem("username");
					localStorage.removeItem("firstName");
					localStorage.removeItem("lastName");
					localStorage.removeItem("email");
					location.href = "../index.html";
				}
			});
		} else if(this.readyState == 4 && this.status == 500){
			M.toast({
				html: "<span>Error deactivating. Returning to homepage...</span>",
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