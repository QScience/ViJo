var vijoAPI = (function() {
	var variable;

	return {
		createViJo: function createViJo(id) {
			var publication;
			publication = vijo.papersNDDB().db[id];

			/*
			 * Note: Should fill the values with some tag cloud like keywords.
			 */
			jQuery.ajax({
				url: 'http://vijo.inn.ac/api/virtualjournals.json',
				type: 'POST',
				data: {
					'virtualjournal':{
						'title': 'test',
						'description':'test',
						'authors':'test',
						'discipline':'test',
						'title_contains':'test',
						'abstract_contains':'test',
						'papers_similar_to_author':'test',
						'papers_similar_to_keywords':'test',
						'minimum_amount_of_tweets':'test',
						'created':'test',
						'institution':'test',
						'is_published_in':'test'
					},
				},
				success: function(data, textStatus, jqXHR) {
					console.log(data);
				}
			});
		},

		sendViJoPaper: function sendViJoPaper(id) {
			var publication, date;
			publication = vijo.papersNDDB().db[id];
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