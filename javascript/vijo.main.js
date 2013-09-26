
var vijo = (function() {
	var createNDDBFromData, createUserInterface, papersNDDB;

	jQuery(document).ready(function jqueryReady() {
		createNDDBFromData();
		createUserInterface();
	});

	createNDDBFromData = function () {
		papersNDDB = new NDDB();
		papersNDDB.importDB(vijoData);
	};

	createUserInterface = function () {
		var iter, htmlTable;
		htmlTable = [];
		htmlTable.push('<p>Action, based on selected: &nbsp; <select><option>Send to ViJo</option><option>Create a Virtual Journal</option></select></p>');
		htmlTable.push('<table id="vijo-papers-table">');
		htmlTable.push('<thead>');
		htmlTable.push('<tr><th><input type="checkbox" id="" name="" /></th><th>Title</th><th>Abstract</th><th>Author(s)</th><th>Create Virtual Journal</th><th>Send to Virtual Journal</th></tr>');
		htmlTable.push('</thead>');
		htmlTable.push('<tbody>');
		for (iter in papersNDDB.db) {
			htmlTable.push('<tr class="marged"><td><input type="checkbox" id="" name="" /></td><td>' + papersNDDB.db[iter].title + '</td><td>' + papersNDDB.db[iter].abstract + '</td><td>' + papersNDDB.db[iter].authors.join(', ') + '</td><td><input type="button" value="Create a ViJo" onClick="vijoAPI.createViJo(' + iter + ');" /></td><td><input type="button" value="Send To Vijo" onClick="vijoAPI.sendViJoPaper(' + iter + ');" /></td></tr>');
		}
		htmlTable.push('<t/body>');
		htmlTable.push('</table>');
		htmlTable = htmlTable.join('');
		document.getElementById('vijo-main').htmlContent = htmlTable;
		document.getElementById('vijo-main').innerHTML = htmlTable;
	};

	return {
		papersNDDB: function() {
			return papersNDDB;
		}
	};
})();