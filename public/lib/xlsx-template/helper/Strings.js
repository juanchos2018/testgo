var Strings = {
	build: function () {
		return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + "\n" +
            '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" uniqueCount="' + Strings.content.length + '"><si><t>' +
            Strings.content.join('</t></si><si><t>') + '</t></si></sst>';
	},
	content: [],
	init: function (xml) {
		var sharedStrings = parseXML(xml);

        if ('sst.si.t' in sharedStrings) {
        	Strings.content.length = 0;
            Strings.content = sharedStrings['sst.si.t'];
        }
        console.log('Strings.content', Strings.content);
	},
	set: function (string) {
		if (string) {
			if (string.indexOf('&') > -1 || string.indexOf('>') > -1 || string.indexOf('<') > -1) {
	            string = string
	            	.replace(/&/g, '&amp;')
	            	.replace(/>/g, '&gt;')
	            	.replace(/</g, '&lt;')
	            ;
	        }

	        var index = Strings.content.indexOf(string);

	        if (index < 0) {
	            return Strings.content.push(string) - 1;
	        } else {
	        	return index;
	        }
		} else {
			return -1;
		}
	}
};