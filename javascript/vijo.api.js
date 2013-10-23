var vijoAPI = (function() {
	var extractKeywords, arrayIntersect, joinKeywords, getInnAcUsername;
	/*
	 * otherWords is an array of words that must be excluded from the counting.
	 * (Those words are not considered as keywords)
	 * common is also an array of words, but if you don't have common words, we'll use our default ones.
	 */
	extractKeywords = function(text, otherWords, common) {
		var punctuation, iter, keywords, escapeRegExp, result;
		escapeRegExp = function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		};
		if (!common) {
			common = ['its', 'it\'s', 'which', 'our', 'yet', 'the', 'then', 'these', 'how', 'thus', 'we', 'no', 'yes', 'is', 'well', 'when', 'and', 'a', 'are', 'as', 'an', 'that', 'i', 'it', 'not', 'he', 'has', 'you', 'this', 'but', 'his', 'they', 'her', 'she', 'or', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'number', 'be', 'have', 'do', 'say', 'get', 'make', 'go', 'know', 'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above'];
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
			keywords[text[iter]] = keywords[text[iter]] === undefined ? 1 : keywords[text[iter]] + 1;
		}

		text = Object.keys(keywords);
		result = [];
		for (iter in text) {
			result[iter] = {
				word: text[iter],
				frequency: keywords[text[iter]],
			};
		}

		result.sort(function(a, b) {
			return a.frequency - b.frequency;
		});

		return result.reverse();
	};

	arrayIntersect = function(a, b) {
		return jQuery.grep(a, function(i) {
			return jQuery.inArray(i, b) > -1;
		});
	};

	joinKeywords = function(object) {
		var iter, result;
		result = [];
		for (iter in object) {
			result.push(object[iter].word);
		}

		return result.join('\n');
	};

	getInnAcUsername = function(callback) {
		var result, innAcWidgetUrl;
		innAcWidgetUrl = 'http://inn.ac/innacwidget?callback=?';
		jQuery.getJSON(innAcWidgetUrl, function(data) {
			var username, html;
			html = document.createElement('div');
			html.id = 'vijoToDelete';
			html.innerHTML = data.html;
			document.getElementsByTagName('html')[0].insertBefore(html, document.getElementsByTagName('body')[0]);
			username = document.getElementById('innacWidgetUsername') ? (document.all ? document.getElementById('innacWidgetUsername').innerText.trim() : document.getElementById('innacWidgetUsername').textContent.trim()) : '';
			document.getElementById('vijoToDelete').innerHTML = '';
			callback(username);
		});
	};

	return {
		/*
		 * We assume that publication is an object with:
		 * .title: its title (string)
		 * .abstract: its abstract (string)
		 * .authors: an array of authors
		 */
		createViJo: function createViJo(publication, callback, givenUsername) {
			var pub = {};
			if (!isNaN(publication)) {
				pub = vijoData[publication];
			} else {
				pub.title = publication.title;
				pub.abstract = publication.abstract;
				pub.authors = publication.authors;
			}

			getInnAcUsername(function(username) {
				var date, keywords;
				if (!username || username === '') {
					username = givenUsername || '';
				}
				date = pub.date || new Date();
				date = new Date(date).toISOString();
				keywords = extractKeywords(pub.abstract);
				pub.hotKeywords = keywords.slice(0, 5);
				pub.keywords = keywords.slice(5, 10);
				pub.allKeywords = keywords.slice(10, 15);

				pub.hotKeywords = joinKeywords(pub.hotKeywords);
				pub.keywords = joinKeywords(pub.keywords);
				pub.allKeywords = joinKeywords(pub.allKeywords);
				pub.authors = pub.authors.join('\n');

				jQuery.ajax({
					url: 'http://vijo.inn.ac/api/virtualjournals.json?api_pass=3944BE0ACB0E69452EED49A35E0F18AC3E9667C1',
					type: 'POST',
					data: {
						'virtualjournal': {
							'belongs_to_logged_in_user': username,
							'contains_authors_in_references': pub.authors,
							'contains_authors_in_references_weight': 10,
							'contains_keywords_important': pub.hotKeywords,
							'contains_keywords_normal': pub.keywords,
							'contains_keywords_supplementary': pub.allKeywords,
							'created': date,
							'created_by': username,
							'created_by_url': window.location.hostname + Drupal.settings.basePath,
							'description': pub.title,
							'modified': date,
							'title': pub.title,
							'views': '0',
						}
					},
					success: callback,
				});
			});
		},

		sendViJoPaper: function sendViJoPaper(publication) {
			var date;
			date = publication.date || new Date();
			date = new Date(date).toISOString();
			publication.authors = publication.authors.join('\n');
			jQuery.ajax({
				url: 'http://vijo.inn.ac/api/publications.json',
				type: 'POST',
				data: {
					'publication': {
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