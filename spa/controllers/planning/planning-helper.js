var Planning = {};

Planning.zipFile = null;

Planning.readSheetsFromXlsx = function (file) {
	var $ = window.jQuery;
	var reader = new FileReader();
	var deferred = $.Deferred();

    Planning.zipFile = null;

	reader.onload = function (e) {
		try {
			Planning.zipFile = new JSZip(e.target.result);
			var workbook = Planning.zipFile.file('xl/workbook.xml');

			if (workbook) {
				var xml = new DOMParser().parseFromString(workbook.asText(), 'text/xml');
				var sheets = xml.getElementsByTagName('sheets')[0];
				var names = [];

				[].forEach.call(sheets.childNodes, function (sheet) {
					names.push(sheet.getAttribute("name"));
				});
			}
		} catch (e) {
			console.warn(e.message);
		}

		deferred.resolve(names);
	};

	reader.onerror = function () {
		deferred.reject(this);
	};

	reader.readAsArrayBuffer(file);

	return deferred.promise();
};

Planning.getFileFromXlsx = function (path) {
    if (Planning.zipFile) {
        try {
            var file = Planning.zipFile.file(path);

            if (file) {
                return file.asText();
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    return null;
};
