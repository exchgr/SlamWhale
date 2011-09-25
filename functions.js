var boxInitHeight;

window.onload = function() {
	boxInitHeight = $("#box").height() + 20;
}

$(document).ready(function() {
	$.ajaxSetup ({  
	    cache: false  
	});

	$("#line").focus(function() {
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

	$("form#lineForm").submit(function() {
		$("#manipulable").html("<div style=\"text-align: center;\"><img src=\"images/loading.gif\" id=\"loading\" /></div>");
		$("#box").animate({
    		height: boxInitHeight + $("#manipulable").outerHeight(true)
		}, 600);
		$.getJSON(
			"api/rhyme.php",
			{line: $("#line").val()},
			function(json) {
				var string = "<ul id=\"poem\">";
				for (var i = 0; i < json.poem.length; i++) {
					string += "<li>" + json.poem[i] + "</li>";
				}
				string += "</ul>";
				if (json.hashtags != null) {
					string += "<h3>Hashtags worth using</h3><ul id=\"hashtags\">";
					for (i = 0; i < json.hashtags.length; i++) {
						string += "<li><a href=\"#\" onclick=\"addToTextbox(\'" + json.hashtags[i] + "\')\" id=\"hashtag" + i + "\">" + json.hashtags[i] + "</a></li>";
					}
					string += "</ul>";
				}
				$("#manipulable").html(string);
				$("#box").animate({
		    		height: boxInitHeight + $("#manipulable").outerHeight(true)
				}, 600);
			}
		)
		return false;
	});

	$("a#submit").click(function() {
		$("form#lineForm").submit();
		return false;
	});
});

function addToTextbox(text) {
	$("#line").val($("#line").val() + " " + text);
}