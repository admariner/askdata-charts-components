var environment = "https://" + window.location.hostname;
var environment_data = "https://smart" + window.location.hostname;
var environment_widget = "https://api.askdata.com";

var environment_auth = "https://askdata.com";

if (window.location.hostname.indexOf("-dev") > -1) {
	environment_auth = "https://app-dev.askdata.com";
	environment_widget = "https://api-dev.askdata.com";
}

if (window.location.hostname.indexOf("-qa") > -1) {
	environment_auth = "https://app-qa.askdata.com";
	environment_widget = "https://api-qa.askdata.com";
}
