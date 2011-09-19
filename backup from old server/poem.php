<?php

	require_once "rhyme.php";

    error_reporting(1);

	public $lines; //lines of the final poem
	public $count = 0;

	public function __construct($lineToRhyme) 
	{
		$this->lines[0] = $lineToRhyme;
		start($lineToRhyme); // Bring in the first line.
	}

	public function start($initial_tweet)
	{
		if($count === 3) //change this number if you want more lines
		{
			//end
			echo json_encode(array($this->lines, null));
		}
		$count++;
		if(isAllHash(initial_tweet))
		{
			$inital_tweet = getTweet( explode(" ", inital_tweet)[0] );
		}
		start( feedRhyme(initial_tweet) );
	}

	/*feeds a complete tweet to rhyme
	when finished loads the lines of rhyme into into $lines
	returns one of the hashes from rhyme*/
	public function feedRhyme($tweet)
	{
		$r = new rhyme($tweet);
		for($i=0; $i<count($r->hashtags); $i++)
		{
			$lines[]=$r->hashtags[i];
		}
		return $r->hashtags[0];	
	}

	//gets a random tweet using a hash tag, returns string
	public function getTweet($hashTag)
	{
		return "I love pizza #fml #lovelife #harrypotter #pennapps";
	}

?>
