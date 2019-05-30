document.addEventListener('DOMContentLoaded', function(){
	if(typeof(Storage) !== "undefined"){
		if(localStorage.getItem("Api-Key") != null){
			M.toast({
				html: "<span>Why are you here? 🤨 Returning to homepage ...</span>",
				classes: "rounded",
				displayLength: 2000,
				completeCallback: function(){
					location.href = "../index.html";
				}
			});
		} else {
			M.FormSelect.init(document.querySelectorAll("select"));
		}
	} else {
		alert("Browser not supported! Please use Google Chrome or Mozilla Firefox");
	}
});

function signupAction(){
	var selectVar = document.querySelectorAll("select")[0];
	var usernameString = document.getElementById("usernameBox").value;
	var passwordString = document.getElementById("passwordBox").value;
	var passwordConfirmationString = document.getElementById("confirmingPasswordBox").value;
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
		return -1;
	} else {
		dateOfBirthString = document.getElementById("user-dob-year").value + "-" + document.getElementById("user-dob-month").value + "-" + document.getElementById("user-dob-day").value;
	}
	var currentSelectInstance = M.FormSelect.init(selectVar);
	var genderString = parseInt(currentSelectInstance.getSelectedValues()[0]);
	var emailString = document.getElementById("emailBox").value;
	var emailConfirmationString = document.getElementById("confirmingEmailBox").value;
	var personalIDString = document.getElementById("personalIDBox").value;
	var addressString = document.getElementById("addressBox").value;
	var phoneNumberString = document.getElementById("phoneNumberBox").value;


	if(usernameString == "" || usernameString == null || usernameString == undefined ||
		passwordString == "" || passwordString == null || passwordString == undefined ||
		passwordConfirmationString == "" || passwordConfirmationString == null || passwordConfirmationString == undefined ||
		firstNameString == "" || firstNameString == null || firstNameString == undefined ||
		lastNameString == "" || lastNameString == null || lastNameString == undefined ||
		emailString == "" || emailString == null || emailString == undefined ||
		emailConfirmationString == "" || emailConfirmationString == null || emailConfirmationString == undefined ||
		addressString == "" || addressString == null || addressString == undefined ||
		phoneNumberString == "" || phoneNumberString == null || phoneNumberString == undefined ||
		(genderString < 0 || genderString > 2 || genderString == NaN)){
		M.toast({
			html: "<span>Please fill in all of the details!</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else if(passwordString != passwordConfirmationString){
		M.toast({
			html: "<span>Password doesn't match! Please check!</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else if(emailString !=emailConfirmationString){
		M.toast({
			html: "<span>Email doesn't match! Please check!</span>",
			classes: "rounded",
			displayLength: 2000
		});
	} else {
		var userNewDetails = {
			personalID: personalIDString,
			email: emailString,
			username: usernameString,
			password: passwordString,
			phoneNumber: phoneNumberString,
			firstName: firstNameString,
			lastName: lastNameString,
			dateOfBirth: new Date(dateOfBirthString),
			address: addressString,
			gender: genderString
		};
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://bookandgo-api.herokuapp.com/user?mode=sign_up", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				var returnedData = JSON.parse(this.responseText);
				if(returnedData.errorCode == 500){
					M.toast({
						html: "<span>" + returnedData.errorMessage + "</span>",
						classes: "rounded",
						displayLength: 2000
					});
				} else {
					M.toast({
						html: "<span>Successfully created your account! You may now login to the system!</span>",
						classes: "rounded",
						displayLength: 2000,
						completeCallback: function(){
							location.href = "../index.html";
						}
					});
				}
			}
		};
		xhttp.send(JSON.stringify(userNewDetails));
	}
}