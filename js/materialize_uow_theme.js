window.onscroll = function(){
	scrollListener();
}

document.addEventListener('DOMContentLoaded', function(){
	var sidenav = document.querySelectorAll('.sidenav');
	var collapsibles = document.querySelectorAll('.collapsible');
	var dropdowns = document.querySelectorAll('.dropdown-trigger');
	// var carousels = document.querySelectorAll('.carousel');
	var modals = document.querySelectorAll('.modal');

	var accountSettingsButtons = document.querySelectorAll('.account-settings');
	var accountSettingsList = document.querySelectorAll('.account-settings-list');

	initElement(accountSettingsButtons, "onclick", "showAccountSettings();");
	initElement(accountSettingsList, "style", "display: none;");
	scrollListener();

	M.Sidenav.init(sidenav, {
		'dragable': true,
		'preventScrolling': true
	});
	M.Collapsible.init(collapsibles);
	M.Dropdown.init(dropdowns, {
		'alignment': "right",
		'coverTrigger': false
	});
	// if(carousels.length >= 1){
	// 	M.Carousel.init(carousels, {
	// 		'duration' : 200,
	// 		'fullWidth': true,
	// 		'indicators': true
	// 	});
	// 	var carouselInstance = M.Carousel.getInstance(carousels[0]);
	// 	setInterval(function(){
	// 		carouselInstance.next();
	// 	}, 10000);
	// }
	
	M.Modal.init(modals, {
		'startingTop': '18%',
		'endingTop': '28%'
	});
});

function scrollListener(evt){
	var mainBody = document.querySelectorAll('.main-body')[0];
	var eventTable = document.querySelectorAll('.events-table')[0];
	var brandLogo = document.querySelectorAll('.brand-logo')[0];
	if(window.pageYOffset >= (mainBody.offsetTop - 38)){
		brandLogo.className = "brand-logo horizontal hide-on-small-and-down";
		brandLogo.children[0].className = "hidden";
		brandLogo.children[1].className = "";
	} else {
		brandLogo.className = "brand-logo hide-on-small-and-down";
		brandLogo.children[0].className = "";
		brandLogo.children[1].className = "hidden";
	}
}

function initElement(elements, attributeName, attributeValue){
	for(var i = 0; i < elements.length; i++){
		elements[i].setAttribute(attributeName, attributeValue);
	}
}

function showAccountSettings(){
	var accountSettingsButtons = document.querySelectorAll('.account-settings');
	var accountSettingsList = document.querySelectorAll('.account-settings-list');
	for(var i = 0; i < accountSettingsList.length; i++){
		if(accountSettingsList[i].style.display == "none"){
			accountSettingsButtons[i].innerHTML = "<span class=\"white-text\">Hide options<i class=\"material-icons\">expand_less</i></span>";
			accountSettingsList[i].style.display = "";
		} else {
			accountSettingsButtons[i].innerHTML = "<span class=\"white-text\">More options<i class=\"material-icons\">expand_more</i></span>";
			accountSettingsList[i].style.display = "none";
		}
	}

}