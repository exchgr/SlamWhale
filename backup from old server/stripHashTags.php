<?php

	//strips hashtags out of string, returns string
	function stripHashTags($tweetString)
	{
		$newString = "";
		$words = explode(" ", $tweetString);
        
       	$i=count($words)-1;
		while($i>0)
		{
			if(substr($words[$i], 0, 1) != "#")
			{
				$newString = $words[0];
            	for($j=0; $j<=$i; $j++)
				{
					$newString." ".$words[$i];
				}
				return $newString;
			}
        	$i--;
		}
		//in case it's all hash tags
		return NULL;
		
     /*
		//looping backwards so I can ignore all the hashtags that happen at the end (in the for loop first)
		$last_words_index = count($words)-1;
		$lastWordOfSentence = true;//this is true until we hit a non Hashtag Word
		for($i=$last_words_index; $i>=0; $i--)
		{
			//is the word a tag? and is it not the last word of the tweet? If so use it
			if(substr($words[$i], 0, 1) === "#" && !$lastWordOfSentence)
			{
				//is this the correct notation for concating in the front?
				$newString = substr($words[$i], 1)." ".$newString;
			}
			//is the word not a tag? cool, use it
			else(substr($words[$i], 0, 1) !== "#")
			{
				if($lastWordOfSentence)//this just keeps the spaces nice
				{
					$newString = $words[$i];
				}
				else
				{
					$lastWordOfSentence = false;
					$newString = $words[$i]." ".$newString;
				}
			}
		}
		return $newString;
	*/
	}
?>
