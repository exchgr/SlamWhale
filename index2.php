<!DOCTYPE HTML>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no;" />
		<title>SlamWhale</title>
		<link rel="stylesheet" href="mobile.css" type="text/css" media="screen" />
		<script type="text/javascript" language="javascript" src="include/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" language="javascript" src="functions.js"></script>
	</head>
	<body>
		<img src="logo.png">
		<div id="box">
			<h1>SlamWhale</h1>
			<h2>Automated poetry from tweets.</h2>
			<form onsubmit="rhyme($('#lineToRhyme').val()); return false;">
				<input type="text" id="lineToRhyme" value="Spit it." class="grey" />
				
				<div class="button" id="left">
					<input type="submit" value="Tweet" id="tweet" />
                </div>
				<div class="button" id="center">
					<input type="submit" value="Refresh" id="refresh" />
				</div>
				<div class="button" id="right">
					<input type="submit" value="Submit it." id="submit" />
				</div>
				<br />
				<p>Enter a line of poetry. Include hashtags for more relevant lines.
			</form>
			<div id="manipulable"></div>
		</div><!--/box-->
		<? echo "bullshit"; ?>
		<div id="copyright">
			<p>© 2011 Dan Mundy, Devon Peticolas, Andrew Jaeger, Bilal Quadri</p>
			<p>Using Twitter, Rhymebrain, jQuery, CloudMine</p>
		</div><!--/copyright-->
	</body>
</html>
