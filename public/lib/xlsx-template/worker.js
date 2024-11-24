importScripts('helper/xml-parser.js');
importScripts('helper/function-parser.js');
importScripts('helper/Strings.js');
importScripts('helper/Utils.js');

var zip, sheets = [], autoExpand = true;

onmessage = function (e) {
    var message = e.data;

    if (message.constructor.name === 'ArrayBuffer') {
        zip = new JSZip(message);

        var workbook = zip.file('xl/workbook.xml');

        if (workbook) {
            sheets.length = 0;

            Strings.init(zip.file('xl/sharedStrings.xml').asText());

            var workbookXML = parseXML(workbook.asText());

            if ('workbook.sheets.sheet[]' in workbookXML) {
                workbookXML['workbook.sheets.sheet[]'].forEach(function (sheet) {
                    sheets.push({ id: sheet.sheetId, name: sheet.name });
                });
            } else {
                console.error('Invalid XLSX file');
            }

            //console.log('sheets', sheets);
        }
    } else if (message.constructor.name === 'Array') {
        var action = message.shift();

        switch (action) {
            case 'options':
                var options = message.shift();

                if ('libPath' in options) {
                    importScripts(options.libPath + '/jszip.min.js');
                }

                if ('expandRange' in options) {
                    autoExpand = options.expandRange;
                }

                break;
            case 'data':
                if (zip) {
                    var data = message.shift();

                    var options = message.shift();

                    if ('callback' in options) {
                        options.callback = parseFunction(options.callback);
                        data = options.callback(data);
                    }

                    var range = options.range;

                    data = Utils.normalizeSheetData(data);
                    range = Utils.normalizeSheetRange(range, data);

                    Object.keys(data).forEach(function (sheetName) {
                        console.log('sheetName', sheetName);
                        var sheetPath = 'xl/worksheets/sheet' + Utils.getSheetId(sheetName) + '.xml';
                        var sheet = zip.file(sheetPath);

                        if (sheet) {
                            var sheetText = sheet.asText();
                            var sheetXML = parseXML(sheetText);
                            var sheetData = data[sheetName];
                            var sheetRange = range[sheetName];
                            var rowsText = sheetText.substring(sheetText.indexOf('<row '), sheetText.lastIndexOf('</row>')) + '</row>';
                            var rows = [];
                            var rowTags = [];
                            var sheetDim = sheetXML['worksheet.dimension[]'][0].ref;

                            //console.log('dimension', sheetDim);

                            //console.log('data', data[sheetName]);
                            //console.log('range', range[sheetName]);

                            rowsText.split('<row ').filter(Utils.emptyFilter).forEach(function (rowText) {
                                var attrs = rowText.substring(0, rowText.indexOf('>'));
                                var colsText = rowText.substring(rowText.indexOf('>') + 1, rowText.indexOf('</row>'));

                                //console.log('ATRIBUTOS ROW', attrs);
                                //console.log('COLUMANS ROW', parseXML(colsText));

                                var rowPos = parseInt(Utils.getAttrFromText('r', attrs), 10) - 1;

                                rows[rowPos] = [];
                                rowTags[rowPos] = '<row ' + attrs + '>';

                                colsText.split('<c ').filter(Utils.emptyFilter).forEach(function (colText) {
                                    var pos = Utils.getAttrFromText('r', colText);
                                    var colPos = Utils.getCol(pos, true) - 1;

                                    rows[rowPos][colPos] = '<c ' + colText;

                                    //console.log('c', Utils.getCol(Utils.getAttrFromText('r', c), true));
                                });
                            });

console.log('rowTags', rowTags);

                            var copyMode = false;
                            var rowIndex = 0;
                            var rowMaxIndex = 0;
                            var colStartIndex = 0;

                            if (sheetRange.indexOf(':') > -1) {
                                var rangeParts = sheetRange.split(':');

                                rowIndex = Utils.getRow(rangeParts[0]);
                                rowMaxIndex = Utils.getRow(rangeParts[1]);
                                colStartIndex = Utils.getCol(rangeParts[0], true); // Numeric
                            } else {
                                rowIndex = Utils.getRow(sheetRange);
                                rowMaxIndex = rowIndex;
                                colStartIndex = Utils.getCol(sheetRange, true); // Numeric
                            }

                            if (rowIndex > rows.length || rowMaxIndex > rows.length) {
                                console.error('Range exceeds limit of sheet (' + sheetName + ')');
                            } else {
                                //console.log('sheetData', sheetData);
                                for (var i = 0; i < sheetData.length; i++) {
                                    if (rowIndex <= rowMaxIndex) {
                                        var row = rows[rowIndex - 1];

                                        if (!! row) { // Exist content in rows[rowIndex]
                                            var rowData = sheetData[i]; // An array of data for each col);

                                            if (colStartIndex > row.length || (colStartIndex + rowData.length - 1) > row.length) {
                                                console.error('Data is out of allowed range');

                                                break; // for
                                            } else {
                                                //console.log('%cReemplazar los datos en índice '  + rowIndex, 'background:yellow;color:red;font-size:1.5em');
                                                //console.log('row', row);
                                                //console.log('rowData', rowData);
                                                //console.log('colStartIndex', colStartIndex);

                                                rowTags[rowIndex - 1] = Utils.setAttrFromText('r', rowIndex, rowTags[rowIndex - 1]);

                                                var colIndex = colStartIndex - 1;

                                                rowData.forEach(function (cellData) {
                                                    if (cellData !== null || (typeof cellData === 'string' && cellData.length)) { // If is not empty
                                                        var colContent = row[colIndex];

                                                        if (cellData.constructor.name === 'Array' && cellData.length === 2) {
                                                            // Fórmula
                                                            var cFormula = cellData[0];
                                                            var cValue = cellData[1];

                                                            if (colContent.indexOf('<v>') > -1) {
                                                                colContent = colContent.replace(/<v>\d+(\.\d+)?<\/v>/, '<v>' + cValue + '</v>');
                                                            } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                                colContent = colContent.replace('/>', '><v>' + cValue + '</v></c>');
                                                            } else {
                                                                console.error('Malformed column: value', colContent);
                                                            }

                                                            if (colContent.indexOf('<f>') > -1) {
                                                                row[colIndex] = colContent.replace(/<f>.+<\/f>/, '<f>' + cFormula + '</f>');
                                                            } else if (colContent.indexOf('<v>') > -1) { // Sólo había un valor
                                                                row[colIndex] = colContent.replace('<v>', '<f>' + cFormula + '</f><v>');
                                                            } else {
                                                                console.error('Malformed column: formula', colContent);
                                                            }
                                                        } else {
                                                            if (typeof cellData === 'string') { // String
                                                                cellData = Strings.set(cellData);
                                                                colContent = Utils.setAttrFromText('t', 's', colContent);
                                                            } else {
                                                                cellData = parseFloat(cellData).toString();
                                                            }

                                                            if (colContent.indexOf('<v>') > -1) {
                                                                row[colIndex] = colContent.replace(/<v>\d+(\.\d+)?<\/v>/, '<v>' + cellData + '</v>');
                                                            } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                                row[colIndex] = colContent.replace('/>', '><v>' + cellData + '</v></c>');
                                                            } else {
                                                                console.error('Malformed column', colContent);
                                                            }
                                                        }

                                                    } else { // Se debe vaciar la celda
                                                      var colContent = row[colIndex];

                                                      if (colContent.indexOf('<v>') > -1) {
                                                          row[colIndex] = colContent.replace(/><v>\d+(\.\d+)?<\/v><\/c>/, '/>');
                                                      } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                          row[colIndex] = colContent;
                                                      } else {
                                                          console.error('Malformed column', colContent);
                                                      }
                                                    }

                                                    colIndex++;
                                                });

                                                //console.log('%cRow changed', 'background:white;color:red;font-size:3em;', row);

                                                rowIndex++;
                                            }
                                        } else {
                                            console.error('Content in row ' + rowIndex + ' does not exist');

                                            break; // for
                                        }
                                    } else {
                                        if (autoExpand) {
                                            var row = rows[rowMaxIndex - 1]; // Cloning

                                            if (!! row) {
                                                row = row.slice(0);

                                                rows.splice(rowIndex - 1, 0, row); // Put row in rowIndex-1 position
                                                //rowTags[rowIndex - 1] = Utils.setAttrFromText('r', rowIndex, rowTags[rowMaxIndex - 1]);
                                                rowTags.splice(rowIndex - 1, 0, Utils.setAttrFromText('r', rowIndex, rowTags[rowMaxIndex - 1]));

                                                var rowData = sheetData[i]; // An array of data for each col);
                                                var colIndex = colStartIndex - 1;

                                                rowData.forEach(function (cellData) {
                                                    if (cellData !== null || (typeof cellData === 'string' && cellData.length)) { // If is not empty
                                                        var colContent = row[colIndex];

                                                        if (cellData.constructor.name === 'Array' && cellData.length === 2) {
                                                            // Fórmula
                                                            var cFormula = cellData[0];
                                                            var cValue = cellData[1];

                                                            if (colContent.indexOf('<v>') > -1) {
                                                                colContent = colContent.replace(/<v>\d+(\.\d+)?<\/v>/, '<v>' + cValue + '</v>');
                                                            } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                                colContent = colContent.replace('/>', '><v>' + cValue + '</v></c>');
                                                            } else {
                                                                console.error('Malformed column: value', colContent);
                                                            }

                                                            if (colContent.indexOf('<f>') > -1) {
                                                                row[colIndex] = colContent.replace(/<f>.+<\/f>/, '<f>' + cFormula + '</f>');
                                                            } else if (colContent.indexOf('<v>') > -1) { // Sólo había un valor
                                                                row[colIndex] = colContent.replace('<v>', '<f>' + cFormula + '</f><v>');
                                                            } else {
                                                                console.error('Malformed column: formula', colContent);
                                                            }
                                                        } else {
                                                            if (typeof cellData === 'string') { // String
                                                                cellData = Strings.set(cellData);
                                                                colContent = Utils.setAttrFromText('t', 's', colContent);
                                                            } else {
                                                                cellData = parseFloat(cellData).toString();
                                                            }

                                                            if (colContent.indexOf('<v>') > -1) {
                                                                row[colIndex] = colContent.replace(/<v>\d+(\.\d+)?<\/v>/, '<v>' + cellData + '</v>');
                                                            } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                                row[colIndex] = colContent.replace('/>', '><v>' + cellData + '</v></c>');
                                                            } else {
                                                                console.error('Malformed column', colContent);
                                                            }
                                                        }
                                                    } else { // Se debe vaciar la celda
                                                      var colContent = row[colIndex];
                                                      if (colContent.indexOf('<v>') > -1) {
                                                          row[colIndex] = colContent.replace(/><v>\d+(\.\d+)?<\/v><\/c>/, '/>');
                                                      } else if (/\/>$/ .test(colContent)) { // Empty xml node
                                                          row[colIndex] = colContent;
                                                      } else {
                                                          console.error('Malformed column', colContent);
                                                      }
                                                    }

                                                    colIndex++;
                                                });

                                                for (var j = rowIndex - 1; j < rows.length; j++) {
                                                    if (!! rows[j]) {
                                                        //console.log("%cSE DEBE actualizar LA FILA " + j, "background:green;color:white;font-size:1.5em", rows[j]);
                                                        for (k = 0; k < rows[j].length; k++) {
                                                            if (rows[j][k]) {
                                                                var cellPos = Utils.getAttrFromText('r', rows[j][k]);
                                                                var colChar = Utils.getCol(cellPos);
                                                                var rowNum = Utils.getRow(cellPos);
    //console.log('colChar', colChar, 'NUEVOOO', colChar + (j + 1));
    //console.log('Nuevo row', Utils.setAttrFromText('r', colChar + (j + 1), rows[j][k]));
                                                                rows[j][k] = Utils.setAttrFromText('r', colChar + (j + 1), rows[j][k]);
                                                            } else {
                                                                console.log("%cLa celda rows[" + j + "][" + k + "] ESTA VACIA", "background:green;color:white;font-size:1.5em", rows[j]);

                                                            }
                                                        }
                                                    }

                                                    if (rowTags[j]) {
                                                        rowTags[j] = Utils.setAttrFromText('r', j + 1, rowTags[j]);
                                                    }
                                                }

                                                //console.log('%cRow changed', 'background:white;color:red;font-size:3em;', row);

                                                rowIndex++;

                                                //console.log('%cCrear los datos en índice '  + rowIndex, 'background:yellow;color:red;font-size:1.5em');
                                                //console.log('a partir de row', row);
                                                //console.log('rowData', rowData);


/*


                                                var rowData = sheetData[i];

                                                console.log('%cCrear los datos en índice '  + rowIndex, 'background:yellow;color:red;font-size:1.5em');
                                                console.log('a partir de row', row);
                                                console.log('rowData', rowData);

                                                rowIndex++;*/
                                            } else {
                                                console.error('Content in row ' + rowMaxIndex + ' does not exist');
                                                break; // for
                                            }
                                        } else {
                                            console.error('Data is outside of range');
                                            break; // for
                                        }
                                    }
                                }
                            }

                            //console.log("%cRows", "font-size:2em", rows);

                            var dimParts = sheetDim.split(':');
                            var newSheetDim = Utils.getCol(dimParts.pop()) + rows.length;

                            dimParts.push(newSheetDim);
                            newSheetDim = dimParts.join(':');

                            //console.log('NUEVA DIMENSION', newSheetDim);

                            sheetText = sheetText.replace(' ref="' + sheetDim + '"', ' ref="' + newSheetDim + '"');

                            var newRowsText = '';
console.log('rowTags', rowTags);
                            rows.forEach(function (rowArray, rowIndex) {
                                if (!! rowArray) {
                                    if (!rowTags[rowIndex]) {
                                        console.log('%cSe agrega a newRowsText', 'background:purple;color:white;font-size:3em', rowIndex, rowTags[rowIndex], rowTags[rowIndex] + rowArray.join('') + '</row>');
                                    }
                                    newRowsText += rowTags[rowIndex] + rowArray.join('') + '</row>';
                                }
                            });

                            sheetText = sheetText.replace(/<sheetData>.*<\/sheetData>/, '<sheetData>' + newRowsText + '</sheetData>');

                            zip.file(sheetPath, sheetText)

                            //console.log(sheetName, parseXML(sheet.asText()));
                        }
                    });
                }

                break;
        }
    } else if (message.constructor.name === 'String') {
        switch (message) {
            case 'build':
                if (zip) {
                    zip.file( 'xl/sharedStrings.xml', Strings.build() );
                    postMessage(zip.generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                }

                break;
        }
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
        //console.log('sheet', sheet);

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

            //console.log('encontrados:', dataXML.length);

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
