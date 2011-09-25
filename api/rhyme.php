<?
	require_once("../include/Extractor.php");
	require_once("../include/Autolink.php");

	error_reporting(0);

	class Line {
		public $line; // The first line in the Poem
		public $words; // An array of all the words in the first line of the Poem
		public $hashtags; // All the hashtags in the first line
		public $lastWord; // The last word in the line, after hashtags have been stripped
		public $rhymingWords; // Words that rhyme with the last word
		public $lines; // The lines of the poem.

		public function __construct($line) {
			$this->line = trim($line); // Bring in the first line.
			$this->lines[0] = $this->line;
		}

		public function validate() {
			// If a tweet has a URL
			// If a tweet is too long
			// If a tweet begins with a mention
			$extractor = new Twitter_Extractor($this->line);
			if (count($extractor->extractURLs()) > 0) {
				return FALSE;
			} else if (strlen($this->line) > 70) {
				return FALSE;
			} else if ($this->line[0] === "@") {
				return FALSE;
			} else {
				return TRUE;
			}
		}

		public function breakLine() {
			$this->words = explode(" ", $this->line); // Break the line into words.
		}

		public function collectHashtags() {
			foreach ($this->words as $word) {
				if ($word[0] === "#") {
					$this->hashtags[] = $word;
				}
			}
		}

		public function stripEndHashtags() // get rid of hashtags at the end of the line.
		{
	       	$i = count($this->words) - 1; // Start at the end of $this->words.
	       	if ((preg_match("/[\.!\?\"]$/", $this->words[$i]) === 1) // if the last character in the last word is punctuation,
	       		|| ($this->words[$i] === "") // There are no words
	       		|| (count($this->words) <= 1)) { // There is at most one word
	       		return; // it's a sentence. Don't chop it.
	       	}
			while ($i >= 0) { // Work backwards.
				if ($this->words[$i][0] === "#") { // If this word isn't a hashtag
					$i--; // Step backwards.
				} else {
					$this->words = array_splice($this->words, 0, $i + 1); // Stop iterating, and keep the string from here below.
					return; // End the function.
				}
			}
			$this->words = ""; // The entire line is hashtags.
		}

		public function getLastWord() {
			$this->lastWord = $this->words[count($this->words) - 1]; // Get the last word of the line.
			$this->lastWord = preg_replace("/[\.!\?\"]$/", "", $this->lastWord);
		}

		public function getRhymingWords() {
			$rhymingWordsTemp = json_decode(file_get_contents("http://rhymebrain.com/talk?function=getRhymes&word=" . $this->lastWord)); // Get rhymes for the last word.
			for ($i = 0; $i < count($rhymingWordsTemp); $i++) {
				$this->rhymingWords[$i] = $rhymingWordsTemp[$i]->word;
			}
		}

		public function searchTwitter() {
			foreach ($this->rhymingWords as $rhymingWord) {
				$twQuery = $rhymingWord;
				if ($this->hashtags != NULL) {
					foreach ($this->hashtags as $hashtag) {
						$twQuery .= " OR " . $hashtag;
					}
				}
				$twResults = json_decode(file_get_contents("http://search.twitter.com/search.json?q=" . rawurlencode($twQuery) . "&result_type=mixed&count=50&lang=en"));
				foreach ($twResults->results as $twResult) {
					if (count($this->lines) < 6) {
						if ($twResult->text != NULL) {
							$twLine = new Line($twResult->text);
						}
						if (!$twLine->validate()) {
							continue;
						}
						$twLine->breakLine();
						$twLine->collectHashtags();
						$twLine->stripEndHashtags();
						$twLine->getLastWord();
						if ($twLine->lastWord === $rhymingWord) {
							$this->lines[] = $twResult->text;
							foreach ($twLine->hashtags as $hashtag) {
								if (count($this->hashtags) < 10) {
									$this->hashtags[] = $hashtag;
									$this->hashtags = array_unique($this->hashtags);
								} else {
									continue;
								}
							}
							break;
						}
					} else {
						return;
					}
				}
			}
		}

		function run() { // Do everything in order.
			$this->breakLine();
			//$this->collectHashtags(); // Collect all the hashtags in the line.
			$this->stripEndHashtags(); // Strip the hashtags at the end of the line.
			$this->getLastWord();
			$this->getRhymingWords();
			$this->searchTwitter();
			echo json_encode(array("poem" => $this->lines, "hashtags" => $this->hashtags));
		}
	}

	$line = new Line($_GET["line"]);
	$line->run();
?>