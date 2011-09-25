<!DOCTYPE HTML>
<html>
	<head>
		<title>SlamWhale</title>
		<link rel="stylesheet" href="style.css" type="text/css" />
		<link rel="stylesheet" href="mobile.css" type="text/css" />
		<script type="text/javascript" language="javascript" src="include/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" language="javascript" src="include/spin.min.js"></script>
		<script type="text/javascript" language="javascript" src="functions.js"></script>
		<?
			$browser = strpos($_SERVER['HTTP_USER_AGENT'],"iPhone") || strpos($_SERVER['HTTP_USER_AGENT'],"Android");
			if ($browser == true){
				$browser = 'smartphone';
			}
			if($browser == 'smartphone'){
		?>
		<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
		<?
			}
		?>
	</head>
	<body>
		<div id="box">
			<img src="images/logo.png" id="logo"/>
			<h1>SlamWhale</h1>
			<h2>Automated poetry from tweets.</h2>
			<form id="lineForm">
				<input type="text" id="line" value="Spit it." class="grey" />
				<!--input type="submit" value="Submit it." id="submit" class="button" /-->
				<a class="button" id="submit" href="#">Rhyme</a>
				<p>Give me a line, and I'll rhyme it for you. Put in hashtags for more relevant lines.</p>
			</form>
			<div id="manipulable"></div><!--/manipulable-->
		</div><!--/box-->
		<div id="copyright">
			<p>&copy; 2011 Dan Mundy, Devon Peticolas, Andrew Jaeger, Bilal Quadri</p>
			<p>Using Twitter, Rhymebrain, jQuery, </p>
		</div><!--/copyright-->
	</body>
</html>