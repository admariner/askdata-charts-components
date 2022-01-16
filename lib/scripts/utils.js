'use strict';

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
	//light_blue: 'rgb(237,244,254)'
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function getToken() {
	
	var token;

	// Retrieve auth token for URL of from the Cookies
	if (getUrlParameter('token') != undefined){
	  token = getUrlParameter('token');
	}else{
	  token = Cookies.get('access_token')
	}

	return token;

}

function setAuthHeader(xhr) {
	const token = getToken();
	if (token) {
		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
	}
	xhr.setRequestHeader('Content-Type', 'application/json');
}

function titleSize(title) {

  var size = 30;

  if (title != null && title != "" ) {

    length = title.length;

    if (length > 22) {

      size = 18;

      if (length >= 40) {
        size = 13;
      }
    }
  }

  return size

}

function getLocale(format) {
    var locale = "en-US";
    if (getDecimaltSeparator(format) == ",") {
    locale = "it-IT";
    }
}

// Fix with remote value instead of locale in the IF
/*
if (locale) {
    locale = "en-US"
}
var format = "€ ###,##0.##";
var locale = "en-US"
var myNumber = 342232.22
*/
function isCurrency(format) {
    var isCurrency = false;
    var currency = null;
    
    if (format.indexOf("$") > -1) {
        isCurrency = true;
        currency = "USD";}
    else if (format.indexOf("€") > -1) {
        isCurrency = true;
        currency = "EUR";}
    else if (format.indexOf("£") > -1) {
        isCurrency = true;
        currency = "GBP";}
    else if (format.indexOf("¥") > -1) {
        isCurrency = true;
        currency = "JPY";}
        
        return currency;
}

function isPercentage(format) {
    var isPercentage = false;
    var percentage = "UNK";
    
    if (format.indexOf("%") > -1) {
        isPercentage = true;
        percentage = "PERCENT";}
    else if (format.indexOf("‰") > -1) {
        isPercentage = true;
        percentage = "PERMILLE";}
    return isPercentage;
}

function getDecimaltSeparator(format) {
// Split 0 and get first char ...
var rightPart = format.split("0");
// Firt char from the string
var decimalSeparator = rightPart[1].charAt(0);

// Log decimal separator
console.log(decimalSeparator)
return decimalSeparator
}

function getThousandsSeparator(format) {
var thousandsSeparator =","
if (getDecimaltSeparator(format) == thousandsSeparator) {
    thousandsSeparator == "."
} 
return thousandsSeparator;
}

function getDecimals(format) {

    var numChars = 0;
    
    // Count number of chars after the decimal separator
    numChars = format.split(decimalSeparator)[1].length;
    
    return numChars;
}

// Format number
function formatNumber(value, format) {

	var locale = getLocale(format);
	var currency = isCurrency(format);

    if (isCurrency(format)) {
        return new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(value);
    } else if (isPercentage(format)) {
        return new Intl.NumberFormat(locale, { style: "percent"}).format(value);
    } else {
        return new Intl.NumberFormat(locale).format(value);
    }
}

(function(global) {
	var MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	var COLORS = [
		'#4dc9f6',
		'#f67019',
		'#f53794',
		'#537bc4',
		'#acc236',
		'#166a8f',
		'#00a950',
		'#58595b',
		'#8549ba'
	];

	var Samples = global.Samples || (global.Samples = {});
	var Color = global.Color;

	Samples.utils = {
		// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
		srand: function(seed) {
			this._seed = seed;
		},

		rand: function(min, max) {
			var seed = this._seed;
			min = min === undefined ? 0 : min;
			max = max === undefined ? 1 : max;
			this._seed = (seed * 9301 + 49297) % 233280;
			return min + (this._seed / 233280) * (max - min);
		},

		numbers: function(config) {
			var cfg = config || {};
			var min = cfg.min || 0;
			var max = cfg.max || 1;
			var from = cfg.from || [];
			var count = cfg.count || 8;
			var decimals = cfg.decimals || 8;
			var continuity = cfg.continuity || 1;
			var dfactor = Math.pow(10, decimals) || 0;
			var data = [];
			var i, value;

			for (i = 0; i < count; ++i) {
				value = (from[i] || 0) + this.rand(min, max);
				if (this.rand() <= continuity) {
					data.push(Math.round(dfactor * value) / dfactor);
				} else {
					data.push(null);
				}
			}

			return data;
		},

		labels: function(config) {
			var cfg = config || {};
			var min = cfg.min || 0;
			var max = cfg.max || 100;
			var count = cfg.count || 8;
			var step = (max - min) / count;
			var decimals = cfg.decimals || 8;
			var dfactor = Math.pow(10, decimals) || 0;
			var prefix = cfg.prefix || '';
			var values = [];
			var i;

			for (i = min; i < max; i += step) {
				values.push(prefix + Math.round(dfactor * i) / dfactor);
			}

			return values;
		},

		months: function(config) {
			var cfg = config || {};
			var count = cfg.count || 12;
			var section = cfg.section;
			var values = [];
			var i, value;

			for (i = 0; i < count; ++i) {
				value = MONTHS[Math.ceil(i) % 12];
				values.push(value.substring(0, section));
			}

			return values;
		},

		color: function(index) {
			return COLORS[index % COLORS.length];
		},

		transparentize: function(color, opacity) {
			var alpha = opacity === undefined ? 0.5 : 1 - opacity;
			return Color(color).alpha(alpha).rgbString();
		}
	};

	// DEPRECATED
	window.randomScalingFactor = function() {
		return Math.round(Samples.utils.rand(-100, 100));
	};

	// INITIALIZATION

	Samples.utils.srand(Date.now());

	// Google Analytics
	/* eslint-disable */
	if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-28909194-3', 'auto');
		ga('send', 'pageview');
	}
	/* eslint-enable */

}(this));
