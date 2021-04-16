var environment = "https://" + window.location.hostname;
var environment_data = "https://api.askdata.com";

var environment_auth = "https://askdata.com";

if (window.location.hostname.indexOf("-dev") > -1) {
	environment_auth = "https://app-dev.askdata.com";
	environment_data = "https://api-dev.askdata.com";
}

if (window.location.hostname.indexOf("-qa") > -1) {
	environment_auth = "https://app-qa.askdata.com";
	environment_data = "https://api-qa.askdata.com";
}
