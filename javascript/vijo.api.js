var vijoAPI = (function() {
	var extractKeywords, arrayIntersect, joinKeywords;

	/*
	 * otherWords is an array of words that must be excluded from the counting.
	 * (Those words are not considered as keywords)
	 * common is also an array of words, but if you don't have common words, we'll use our default ones.
	 */
	 extractKeywords = function (text, otherWords, common) {
	 	var punctuation, iter, keywords, escapeRegExp, result;
	 	escapeRegExp = function escapeRegExp(string){
	 		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	 	}
	 	if (!common) {
	 		common = ['our', 'yet', 'the', 'then', 'these', 'how', 'thus', 'we', 'no', 'yes', 'is', 'well', 'when', 'and', 'a', 'are', 'as', 'an', 'that', 'i', 'it', 'not', 'he', 'has', 'you', 'this', 'but', 'his', 'they', 'her', 'she', 'or', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'number', 'be', 'have', 'do', 'say', 'get', 'make', 'go', 'know', 'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above'];
	 	}
	 	punctuation = ['.', ',', '!', '?', ':', ';', '"', '\'', '$', ' - ', ')', '(', '[', ']'];

	 	text = text.toLowerCase().trim();

	 	if (otherWords) {
	 		common = common.concat(otherWords);
	 	}

	 	for (iter in punctuation) {
	 		text = text.replace(new RegExp(escapeRegExp(punctuation[iter]), 'g'), '');
	 	}

	 	for (iter in common) {
	 		text = text.replace(new RegExp(' ' + escapeRegExp(common[iter] + ' '), 'g'), ' ');
	 	}

	 	text = text.split(' ');
	 	keywords = [];

	 	for (iter in text) {
	 		keywords[text[iter]]  = keywords[text[iter]] === undefined ? 1: keywords[text[iter]] + 1;
	 	}

	 	text = Object.keys(keywords);
	 	result = [];
	 	for (iter in text) {
	 		result[iter] = {
	 			word: text[iter],
	 			frequency: keywords[text[iter]],
	 		};
	 	}

	 	result.sort(function(a, b) {return a.frequency - b.frequency});

	 	return result.reverse();
	 };

	 arrayIntersect = function(a, b) {
	 	return jQuery.grep(a, function(i)
	 	{
	 		return jQuery.inArray(i, b) > -1;
	 	});
	 };

	 joinKeywords = function (object) {
	 	var iter, result;
	 	result = [];
	 	for (iter in object) {
	 		result.push(object[iter].word);
	 	}

	 	return result.join('\n');
	 };

	 return {
		/*
		 * We assume that publication is an object with:
		 * .title: its title (string)
		 * .abstract: its abstract (string)
		 * .authors: an array of authors
		 */
		 createViJo: function createViJo(publication) {



		 	publication = vijoData[publication]



		 	var date, keywords;
		 	date = publication.date || new Date();
		 	date = new Date(date).toISOString();
		 	keywords = extractKeywords(publication.abstract);
		 	publication.hotKeywords = keywords.slice(0, 5);
		 	publication.keywords = keywords.slice(5, 10);
		 	publication.allKeywords = keywords.slice(10, 15);

		 	publication.hotKeywords = joinKeywords(publication.hotKeywords);
		 	publication.keywords = joinKeywords(publication.keywords);
		 	publication.allKeywords = joinKeywords(publication.allKeywords);
		 	publication.authors = publication.authors.join('\n');

		 	jQuery.ajax({
		 		url: 'http://vijo.inn.ac/api/virtualjournals.json?api_pass=3944BE0ACB0E69452EED49A35E0F18AC3E9667C1',
		 		type: 'POST',
		 		data: {
		 			'virtualjournal':{
		 				'belongs_to_logged_in_user': 'seba-1511',
		 				'contains_authors_in_references': publication.authors,
		 				'contains_authors_in_references_weight': 10,
		 				'contains_keywords_important': publication.hotKeywords,
		 				'contains_keywords_normal': publication.keywords,
		 				'contains_keywords_supplementary': publication.allKeywords,
		 				'created': date,
		 				'created_by': 'seba-1511',
		 				'created_by_url': window.location.hostname + Drupal.settings.basePath,
		 				'description': publication.title,
		 				'modified': date,
		 				'title': publication.title,
		 				'views': '0'
		 			}
		 		},
		 		success: function(data, textStatus, jqXHR) {
		 			console.log(data);
		 		}
		 	});
		 },

		 sendViJoPaper: function sendViJoPaper(publication) {
		 	var date;
		 	date = publication.date || new Date();
		 	date = new Date(date).toISOString();
		 	jQuery.ajax({
		 		url: 'http://vijo.inn.ac/api/publications.json',
		 		type: 'POST',
		 		data: {
		 			'publication':{
		 				'title': publication.title,
		 				'abstract': publication.abstract,
		 				'authors': publication.authors,
		 				'publication_date': date,
		 				'source': window.location.hostname + Drupal.settings.basePath,
		 			}
		 		},
		 		crossDomain: true,
		 		success: function(data, textStatus, jqXHR) {
		 			console.log(data);
		 		}
		 	});
		 },
		};
	})();