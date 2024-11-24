importScripts('../jszip/jszip.js');
importScripts('../xmlparser/simplexmlparser.js');

var zip = null;
var sheets = [];
var strings = [];

onmessage = function (e) {
    var data = e.data;

    if (data.constructor.name === 'ArrayBuffer') {
        zip = new JSZip(data);

        var wb = zip.file('xl/workbook.xml');

        if (wb) {
            sheets.length = 0;
            strings.length = 0;

            var str = zip.file('xl/sharedStrings.xml');

            if (str) {
                var sharedStrings = parseXML(str.asText());

                if ('sst.si.t' in sharedStrings) {
                    strings = sharedStrings['sst.si.t'];
                }

                console.log('strings', strings);
            }

            var workbook = parseXML(wb.asText());

            if ('workbook.sheets.sheet[]' in workbook) {
                workbook['workbook.sheets.sheet[]'].forEach(function (sheet) {
                    sheets.push({ id: sheet.sheetId, text: sheet.name });
                });

                postMessage({
                    name: 'sheets',
                    message: sheets
                });
            } else {
                console.error('Worker: archivo XLSX inválido');
            }
        }
    } else if ('name' in data) {
        switch (data.name) {
            case 'data':
                if (!data.sheet) {
                    sheets.forEach(function (sheet) { // Leer todas las hojas
                        readSheet(sheet.id, true);
                    });
                } else {
                    readSheet(data.sheet, false); // Leer la hoja especificada
                }
                break;
        }
    }

    // close();
};

function readSheet(id, multiple) {
    if (zip) {
        var sht = zip.file('xl/worksheets/sheet' + id + '.xml');

        if (sht) {
            return getData(sht.asText(), id, multiple);
        } else {
            console.error('Worker: sheet' + id + ' no encontrada');
        }
    } else {
        console.error('Worker: no se econtró archivo XLSX');
    }

    return [];
}

function getSheetName(id) {
    var sheetName = '';

    sheets.forEach(function (sheet) {
        if (sheet.id == id) {
            sheetName = sheet.text;
        }
    });

    return sheetName;
}

function getData(content, sheetId, multiple) {
    var data = [];
    var row = null;
    var tags = content.split('<');
    var type = 'numeric';
    var rowCount = (content.match(/<row/g) || []).length;
    var partialData = [];

    var sendPartial = function () {
        if (partialData.length) {
            var rowPercent = (multiple ? parseInt(sheetId) : 1) / (multiple ? sheets.length : 1);

            postMessage({
                name: 'data',
                sheet: getSheetName(sheetId),
                loaded: data.length / rowCount  * rowPercent,
                data: partialData
            });

            partialData.length = 0;
        }
    };

    var pushData = function () {
        data.push(row);
        partialData.push(row.slice(0));

        if (partialData.length === 100) {
            sendPartial();
        }

        row = null;
    };

    console.log('rows', rowCount);

    for (var i = 0; i < tags.length; i++) {
        var text = tags[i].split('>');
        var parts = text[0].split(' ');

        if (parts[0] === 'row') {
            row = [];

            if (/\/$/ .test(parts[parts.length - 1])) {
                pushData();
            }
        } else if (parts[0] === '/row') {
            pushData();
        } else if (parts[0] === 'c') {
            if (/\/$/ .test(parts[parts.length - 1])) { // Is empty
                row.push('');
            } else {
                if (parts.indexOf('t="s"') > -1) {
                    type = 'string';
                } // Por defecto es de tipo numeric
            }
        } else if (parts[0] === 'v') {
            if (type === 'string') {
                row.push(strings[+text[1]]);
                type = 'numeric';
            } else {
                row.push(+text[1]);
            }
        }
    }

    sendPartial();
    
    return data;
}

function toDate(value) {
    var dateUnix = (value - 25569) * 86400;
    var dateObject = new Date(dateUnix * 1000);
    var dateYear = dateObject.getUTCFullYear();
    var dateMonth = dateObject.getUTCMonth() + 1;
    var dateDay = dateObject.getUTCDate();
    
    return dateYear.toString() + '-' + (dateMonth < 10 ? '0' : '') + dateMonth.toString() + '-' + (dateDay < 10 ? '0' : '') + dateDay.toString();
}