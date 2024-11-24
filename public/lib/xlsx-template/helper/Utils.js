var Utils = {
	emptyFilter: function (data) {
		return !!data;
	},
	getAttrFromText: function (attr, xml) {
		var array = (' ' + xml).split(' ' + attr + '="');

		if (array.length === 2) {
			return array.pop().split('"').shift();
		}

		return '';
	},
	getCol: function (cell, numeric) {

		var col = cell.match(/[A-Z]+/)[0];


		if (!numeric) {
			return col;
		} else {
			if (col.length > 1) {
				var result = 0;

				for (var i = 0; i < col.length; i++) {
					result += col.charCodeAt(i) - 64;
				}

				return result;
			} else {
				return col.charCodeAt(0) - 64;
			}
		}
	},
	/*nextCol: function (col) {
		var parts = col.split('');
		var colChar = parts.pop();
		var colNum = colChar.charCodeAt(0) + 1;

		colNum = (colNum > 90 ? 65 : colNum);

		return parts.join('') + String.fromCharCode(colNum);
	},*/
	getRow: function (cell) {
		var row = cell.match(/\d+/)[0];

		return parseInt(row, 10);
	},
	getSheetId: function (sheetName) {
		var id = '';

		for (var i = 0; i < sheets.length; i++) {
			if (sheets[i].name === sheetName) {
				id = sheets[i].id;
				break;
			}
		}

		return id;
	},
	normalizeSheetData: function (data) {
		var tmpData;

		if (data.constructor.name === 'Array') {
			tmpData = data;
			data = {};
			data[sheets[0].name] = tmpData;
		}

		tmpData = null;

		return data;
	},
	normalizeSheetRange: function (range, data) {
		var tmpData;

		if (range.constructor.name === 'String') {
			tmpData = range;
			range = {};
			Object.keys(data).forEach(function (sheet) {
				range[sheet] = tmpData;
			});
		}

		tmpData = null;

		return range;
	},
	setAttrFromText: function (attr, val, xml) {
		if ( (' ' + xml).indexOf(' ' + attr + '="') > -1 ) {
			var pre = ((xml.indexOf('<') < 0 ? ' ' : '') + xml).split(' ' + attr + '="');

			if (pre.length === 2) {
				var post = pre[1].substring(pre[1].indexOf('"') + 1);

				xml = pre[0] + ' ' + attr + '="' + val.toString() + '"' + post;
			}
		} else if ( xml.indexOf(' ') > -1 ) { // Tag with attributes
			var pre = xml.split(' ');

			pre.splice(1, 0, attr + '="' + val + '"');

			xml = pre.join(' ');
		} // No support for self-closed tags

		return xml;
	},
};