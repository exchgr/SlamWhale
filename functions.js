$(document).ready(function() {
	$("#lineToRhyme").focus(function() {
		if ($(this).hasClass("grey")) {
			$(this).attr("value", "");
			$(this).removeClass("grey");
		}
	}).blur(function() {
		if ($(this).attr("value") === "") {
			$(this).attr("value", "Spit it.");
			$(this).addClass("grey");
		}
	});
});

var rhymedLines;
var newHashtags;

function getXmlHttpRequest() {
	var xmlHttpRequest;
	
	try {
		// Opera 8.0+, Firefox, Safari
		xmlHttpRequest = new XMLHttpRequest();
	}
	catch (e) {
		// Internet Explorer Browsers
		try {
			xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (e) {
				// Something went wrong
				alert("ERROR: Your browser sucks.");
				return false;
			}
		}
	}
	return xmlHttpRequest;
}

function addToTextbox(newHashTag) {
	document.getElementById("lineToRhyme").value += " " + newHashTag;
}

function rhyme(lineToRhyme)
{
	document.getElementById('manipulable').innerHTML = "<div style=\"text-align: center;\"><img src=\"images/loading.gif\" id=\"loading\" /></div>";
	var dataString = "lineToRhyme=" + encodeURIComponent(lineToRhyme);

	var xmlHttpRequest = getXmlHttpRequest();
	xmlHttpRequest.open("POST", "api/rhyme.php?" + dataString, true);
	xmlHttpRequest.send(null);

	xmlHttpRequest.onreadystatechange = function() {
		if (xmlHttpRequest.readyState == 4) {
			rhymedLines = JSON.parse(xmlHttpRequest.responseText)[0];
			newHashtags = JSON.parse(xmlHttpRequest.responseText)[1];

			var string = "<ul id=\"results\">";
			for (var i = 0; i < rhymedLines.length; i++) {
				string += "<li>" + rhymedLines[i] + "</li>";
			}
			string += "</ul>";
			if (newHashtags != null) {
				string += "<h3>Hashtags worth using</h3><ul class=\"newHashtags\">";
				for (i = 0; i < newHashtags.length; i++) {
					string += "<li><a href=\"#\" onclick=\"addToTextbox(\'" + newHashtags[i] + "\')\">" + newHashtags[i] + "</a></li>";
				}
				string += "</ul>";
			}
			document.getElementById('manipulable').innerHTML = string;
		}
	}
}
