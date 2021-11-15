// Retrieve auth token
console.log("Environment: " + environment);
console.log("Data Environment: " + environment_data);

if (getUrlParameter('token') != undefined){
  var token = getUrlParameter('token');
}else{
  var token = Cookies.get('access_token')
}

var theme = []

// Retrieve theme
if (getUrlParameter('theme')) {

    $.getJSON( environment + "/charts/"+getUrlParameter('theme')+"/catalog.json", function( data ) {
      
      console.log("retrieving theme")
      console.log(data)
      
      window.theme = data;

  })

} else {

      $.getJSON( environment + "/charts/askdata/catalog.json", function( data ) {
      
      console.log("retrieving theme")
      console.log(data)
      
      window.theme = data;

     })
}

function setAuthHeader(xhr) {
    if (token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
}

// Request charting data
$.ajax({
         url: environment_data + "/charts/" + getUrlParameter('chartId'),
         type: "GET",
         beforeSend: (xhr) => setAuthHeader(xhr),
         success: function(data) { 

         displayChart(data);

         // Apply custom watermark
         if (data.resultSet.logo) {
            var watermark = data.resultSet.logo;
            $('#watermark-img').attr('src', watermark);
         }

}
}); 

// Redirect to login if not authenticated 
$( document ).ajaxError(function( event, jqxhr, settings, exception ) {
    if ( jqxhr.status== 401 ) {
      location.replace(environment_auth+"/login");

    }
});
