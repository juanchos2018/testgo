window.angular.module('ERP').controller('TestingCtrl', [
    '$scope', '$window', 'Page', 'Ajax', 'FileHandler',
    function ($scope, $window, Page, Ajax, FileHandler) {
        Page.title('Pruebas');

        $scope.date = '';
        $scope.select2 = '';

        $scope.items = [];

        $scope.fillItems = function () {
            $scope.items = [
                { id: 1, text: 'Uno' },
                { id: 2, text: 'Dos' },
                { id: 3, text: 'Tres' },
                { id: 4, text: 'Cuatro' }
            ];
        };

        $scope.data = [];
        $scope.labels = [
            'AVANEXO',
            'ACODANE',
            'ADESANE',
            'AREFANE',
            'ARUC',
            'ACODMON',
            'AESTADO',
            'ADATE',
            'AHORA',
            'AVRETE',
            'APORRE'
        ];

        $scope.getData = function () {
            Ajax.get($window.siteUrl('testing/customers')).then(function (res) {
                var date = moment();

                res.data.forEach(function (row) {
                    $scope.data.push({
                        AVANEXO: 'C',
                        ACODANE: row.id_number,
                        ADESANE: row.full_name,
                        AREFANE: '',
                        ARUC: row.id_number,
                        ACODMON: '',
                        AESTADO: 'V',
                        ADATE: date.format('D [de] MMM [de] YY').toLowerCase(),
                        AHORA: date.format('HH:mm:'),
                        AVRETE: '',
                        APORRE: ''
                    });
                });
            });
        };

        $scope.exportDBF = function () {
            var dataDBF = $scope.data.slice(0);
            var dateTime = new Date() .getTime();

            dataDBF.forEach(function (row) {
                delete row.$$hashKey; // Eliminamos el hash que crea Angular

                row.ADATE = dateTime;
            });

            var dataView = dbf.structure(dataDBF);

            FileHandler.download(new Blob([dataView], {type: 'application/x-dbf'}), 'ANEXOS.dbf');
        };

        $scope.exportExcel = function () {
            /////// AYUDANTES SEGUN LA DOCUMENTACION DE JSXLSX ///////
            function datenum(v, date1904) {
                if(date1904) v+=1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            }
            function sheet_from_array_of_arrays(data, opts) {
                var ws = {};
                var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                for(var R = 0; R != data.length; ++R) {
                    for(var C = 0; C != data[R].length; ++C) {
                        if(range.s.r > R) range.s.r = R;
                        if(range.s.c > C) range.s.c = C;
                        if(range.e.r < R) range.e.r = R;
                        if(range.e.c < C) range.e.c = C;
                        var cell = {v: data[R][C] };
                        if(cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
                        
                        if(typeof cell.v === 'number') cell.t = 'n';
                        else if(typeof cell.v === 'boolean') cell.t = 'b';
                        else if(cell.v instanceof Date) {
                            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        
                        ws[cell_ref] = cell;
                    }
                }
                if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            function Workbook() {
                if(!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            /////// AYUDANTES SEGUN LA DOCUMENTACION DE JSXLSX ///////
             

            // Generamos los datos
            var data = [];
            var ws_name = "ANEXOS";

            data.push($scope.labels);

            $scope.data.forEach(function (row) {
                data.push([
                    row.AVANEXO,
                    row.ACODANE,
                    row.ADESANE,
                    row.AREFANE,
                    row.ARUC,
                    row.ACODMON,
                    row.AESTADO,
                    new Date(),
                    row.AHORA,
                    row.AVRETE,
                    row.APORRE
                ]);
            });
             
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
             
            /* Agregar la hoja al libro */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

            FileHandler.download(new Blob([s2ab(wbout)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'ANEXOS.xlsx');
        };
        
    }
]);
