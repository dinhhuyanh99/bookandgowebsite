document.addEventListener('DOMContentLoaded', function(){
	if(typeof(Storage) !== "undefined"){
		var navUserMenu = document.querySelectorAll(".nav-user-menu")[0];
		var navButtonsList = document.querySelectorAll(".nav-buttons-list")[0];
		var accountSettingsDropdown = document.querySelectorAll("#account-settings-dropdown")[0];
		var userSidenav = document.querySelectorAll("#sidenav-menu-mobile")[0];
		var usernameSlot = document.querySelectorAll(".user-name")[0];
		var userviewSidenav = document.querySelectorAll(".user-view")[0];

		if(localStorage.getItem("Api-Key") == undefined || localStorage.getItem("Api-Key") == "" || localStorage.getItem("Api-Key") == null ||
			localStorage.getItem("Api-Key-Expiration") == undefined || localStorage.getItem("Api-Key-Expiration") == "" ||
			localStorage.getItem("username") == undefined || localStorage.getItem("username") == "" ||
			localStorage.getItem("firstName") == undefined || localStorage.getItem("firstName") == "" ||
			localStorage.getItem("lastName") == undefined || localStorage.getItem("lastName") == "" ||
			localStorage.getItem("email") == undefined || localStorage.getItem("email") == ""){

			navUserMenu.children[2].className = "hidden";
			accountSettingsDropdown.className = "dropdown-content hidden";
			navButtonsList.children[0].className = "hidden";
			navButtonsList.children[1].className = "hidden";
			userSidenav.children[0].className = "hidden";
			userSidenav.children[3].className = "hidden";
			userSidenav.children[4].className = "hidden";

		} else {
			if(new Date(localStorage.getItem("Api-Key-Expiration")).getTime() <= new Date().getTime()){
				localStorage.removeItem("Api-Key");
				localStorage.removeItem("Api-Key-Expiration");
				localStorage.removeItem("username");
				localStorage.removeItem("firstName");
				localStorage.removeItem("lastName");
				localStorage.removeItem("email");
				localStorage.removeItem("accountType");
				M.toast({
					html: "<span>Your session is outdated, please log in again!</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						if(location.pathname == "/index.html"){
							location.reload();
						} else {
							location.href = "../index.html";
						}
					}
				});
			} else {
				usernameSlot.innerHTML = localStorage.getItem("username");
				navUserMenu.children[0].className = "hidden";
				navUserMenu.children[1].className = "hidden";
				userSidenav.children[1].className = "hidden";
				userSidenav.children[2].className = "hidden";
				userviewSidenav.children[2].innerHTML = "<span class=\"white-text name\">" + localStorage.getItem("username") + "</span>";
				userviewSidenav.children[3].innerHTML = "<span class=\"white-text email\">" + localStorage.getItem("email") + "</span>";
			}
		}
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
});

function loginHandler(){
	if(document.getElementById("user_identification_field").value == "" ||
		document.getElementById("user_identification_field").value == undefined ||
		document.getElementById("user_identification_field").value == null) {

		M.toast({html: "Please fill in your username!", classes: "rounded"});
	} else if(document.getElementById("password_field").value == "" ||
		document.getElementById("password_field").value == undefined ||
		document.getElementById("password_field").value == null){

		M.toast({html: "Please fill in your password!", classes: "rounded"});
	} else {
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://bookandgo-api.herokuapp.com/user?mode=sign_in", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				var returnData = JSON.parse(this.responseText);
				if(returnData.errorCode != undefined){
					M.toast({html: returnData.errorMessage, classes: "rounded"});
				} else {
					if(typeof(Storage) !== "undefined"){
						localStorage.removeItem("Api-Key");
						localStorage.removeItem("Api-Key-Expiration");
						localStorage.removeItem("username");
						localStorage.removeItem("firstName");
						localStorage.removeItem("lastName");
						localStorage.removeItem("email");
						localStorage.removeItem("accountType");
						localStorage.setItem("Api-Key", returnData.apiKey);
						localStorage.setItem("Api-Key-Expiration", returnData.expiredOn);
						localStorage.setItem("username", returnData.userDetails.username);
						localStorage.setItem("firstName", returnData.userDetails.firstName);
						localStorage.setItem("lastName", returnData.userDetails.lastName);
						localStorage.setItem("email", returnData.userDetails.email);
						M.toast({
							html: "Logged in successfully, refreshing...",
							classes: "rounded",
							displayLength: 2000,
							completeCallback: function(){
								location.reload();
							}
						});
					} else {
						alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
					}
				}
			} else if(this.readyState == 4 && this.status == 500){
				M.toast({
					html: "<span>Error signing in. Refreshing...</span>",
					classes: "rounded",
					displayLength: 2000,
					completeCallback: function(){
						if(location.pathname == "/index.html"){
							location.reload();
						} else {
							location.href = "../index.html";
						}
					}
				});
			} else if(this.readyState == 4 && this.status == 403){
				M.toast({
					html: "<span>Account is deactivated or banned.</span>",
					classes: "rounded",
					displayLength: 2000
				});
			}
		}

		var userLoginDetails = {
			username: document.getElementById("user_identification_field").value,
			password: document.getElementById("password_field").value
		}

		xhttp.send(JSON.stringify(userLoginDetails));
	}
}

function logoutHandler(){

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "https://bookandgo-api.herokuapp.com/user?mode=sign_out", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Api-Key", localStorage.getItem("Api-Key"));
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && (this.status == 200 || this.status == 500)){
			var returnData = JSON.parse(this.responseText);
			if(returnData.errorCode != undefined){
				M.toast({html: returnData.errorMessage, classes: "rounded"});
			} else {
				if(typeof(Storage) !== "undefined"){
					localStorage.removeItem("Api-Key");
					localStorage.removeItem("Api-Key-Expiration");
					localStorage.removeItem("username");
					localStorage.removeItem("firstName");
					localStorage.removeItem("lastName");
					localStorage.removeItem("email");
					localStorage.removeItem("accountType");
					M.toast({
						html: "Logged out successfully, refreshing...",
						classes: "rounded",
						displayLength: 2000,
						completeCallback: function(){
							location.reload();
						}
					});
				} else {
					alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
				}
			}
		}
	}
	xhttp.send();
}