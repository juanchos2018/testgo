importScripts('helper/xml-parser.js');
importScripts('helper/function-parser.js');

importScripts('lib/jszip.min.js');

var zip = null;
var sheets = [];
var strings = [];

var products = null;
var builtSheets = {};

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
            } else {
                console.error('Worker: archivo XLSX inválido');
            }
        }
    } else if ('group' in data) {
        console.log('data', data);
        if (data.group) {
            products = {};

            data.data.forEach(function (row) {
                var groupValue = row[data.group];

                if (!(groupValue in products)) {
                    products[groupValue] = [];
                }

                products[groupValue].push(row);
            });

            console.log('products', products);

            sheets.forEach(function (sheet) { // Leer todas las hojas
                buildSheet(sheet, data.group);
            });
        } else {
            products = data.data;

            console.log('products', products);
            buildSheet(sheets[0]); // Construir la única hoja
        }

        zip.file('xl/sharedStrings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + "\n" +
            '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" uniqueCount="' + strings.length + '"><si><t>' +
            strings.join('</t></si><si><t>') + '</t></si></sst>'
        );

        postMessage(zip.generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        
        close();
    }
};

function getString(string) {
    if (string) {
        if (string.indexOf('&') > -1) {
            string = string.replace(/&/g, '&amp;');
        }

        if (string.indexOf('>') > -1) {
            string = string.replace(/>/g, '&gt;');
        }

        if (string.indexOf('<') > -1) {
            string = string.replace(/</g, '&lt;');
        }

        var index = strings.indexOf(string);

        if (index < 0) {
            index = strings.push(string) - 1;
        }

        return ' t="s"><v>' + index + '</v></c>';
    } else {
        return '/>'; // Etiqueta vacía
    }
}

function buildSheet(sheet, groupBy) {
    if (zip) {
        console.log('sheet', sheet);

        var groupValue = sheet.text;
        var path = 'xl/worksheets/sheet' + sheet.id + '.xml';
        var sht = zip.file(path);

        if (sht) {
            var contents = sht.asText();
            var data = (groupBy ? products[sheet.text] : products);
            var dataXML = [];
            var rowStart = 6;

            data.forEach(function (product, index) {
                var code = getString(product.code);
                var size = getString(product.size);
                var barcode = getString(product.barcode);
                var line = getString(product.line);
                var gender = getString(product.gender);
                var description = getString(product.description);
                var regime = getString(product.regime);
                var type = getString(product.type);
                var brand = getString(product.brand);
                var output_statement = getString(product.output_statement);

                var rowIndex = rowStart + index;

                dataXML.push(
                    '<row r="' + rowIndex + '" spans="1:15">' +
                        '<c r="A' + rowIndex + '" s="4"' + code +
                        '<c r="B' + rowIndex + '" s="4"' + size +
                        '<c r="C' + rowIndex + '" s="3"/>' +
                        '<c r="D' + rowIndex + '" s="4"' + barcode +
                        '<c r="E' + rowIndex + '" s="4"' + line +
                        '<c r="F' + rowIndex + '" s="4"' + gender +
                        '<c r="G' + rowIndex + '" s="4"' + description +
                        '<c r="H' + rowIndex + '" s="4"' + regime +
                        '<c r="I' + rowIndex + '" s="4"' + type +
                        '<c r="J' + rowIndex + '" s="4"' + brand +
                        '<c r="K' + rowIndex + '" s="4"' + type +
                        '<c r="L' + rowIndex + '" s="4"' + output_statement +
                        '<c r="M' + rowIndex + '" s="3"/>' +
                        '<c r="N' + rowIndex + '" s="3"/>' +
                        '<c r="O' + rowIndex + '" s="3"/>' +
                    '</row>'
                );
            });

            contents = contents.replace('A1:O6', 'A1:O' + (rowStart + dataXML.length - 1));

            console.log('encontrados:', dataXML.length);

            var firstPart = contents.split('<row r="6"');
            var secondPart = firstPart[1].split('</row>');

            zip.file(path, firstPart[0] + dataXML.join('') + secondPart[1]);
        } else {
            console.error('Worker: sheet' + id + ' no encontrada');
        }
    } else {
        console.error('Worker: no se econtró archivo XLSX');
    }

    return [];
}   
