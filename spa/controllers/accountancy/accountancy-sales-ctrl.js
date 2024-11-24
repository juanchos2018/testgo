window.angular.module('ERP').controller('AccountancySalesCtrl', [
    '$scope', '$window', 'Page', 'Ajax', 'FileHandler', '$filter',
    function ($scope, $window, Page, Ajax, FileHandler, $filter) {
        Page.title('Contabilidad Registros');

        $scope.reg =
         {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: ''
        };
        $scope.data = [];
        $scope.labels = [
            'CSUBDIA',
            'CCOMPRO',
            'CFECCOM',
            'CCODMON',
            'CSITUA',
            'CTIPCAM',
            'CGLOSA',
            'CTOTAL',
            'CTIPO',
            'CFLAG',
            'CDATE',
            'CHORA',
            'CUSER',
            'CFECCAM',
            'CORIG',
            'CFORMO',
            'CTIPCOM',
            'CEXTOR',
            'CEFCCOM2',
            'CFECCAM2',
            'COPCION'
        ];
        $scope.filename = '';
        
        this.tab = 0;
        $scope.getData = function () {
            //$scope.reg.dateBegin
            this.tab = 1;
            var date = moment();
            var mes= date.format('MM');
            var j = 1;
            var correlativo = $filter('lpad')(j, 4);
            $scope.filename = 'CTC0315';
            Ajax.post($window.siteUrl('accountancy/get_sales'), $scope.reg).then(function (res) {
           
                $scope.data = [];
                res.data.forEach(function (row) {
                    var date2 = moment(row.cfeccom);
                    $scope.data.push({
                        DSUBDIA: row.cssubdia,
                        CCOMPRO: mes + correlativo,
                        CFECCOM: date2.format('YYMMDD'),
                        CCODMON: 'MN',
                        CSITUA: 'F',
                        CTIPCAM: '2.49',
                        CGLOSA: row.cglosa,
                        CTOTAL: row.ctotal,
                        CTIPO: 'C',
                        CFLAG: 'S',
                        CDATE: date.format('D-MMM-YY'),
                        CHORA: date.format('HH:mm:'),
                        CUSER: 'SIST',
                        CFECCAM: '',
                        CORIG: '',
                        CFORMO: '',
                        CTIPCOM: '',
                        CEXTOR: '',
                        CEFCCOM2: date2.format('D-MMM-YY'),
                        CFECCAM2: '',
                        COPCION: 'S'
                    });
                });
            });
        };

         $scope.getDetailData = function () {
            this.tab = 2;
            $scope.data = [];
            $scope.filename = 'CTD0315';
            Ajax.post($window.siteUrl('accountancy/get_sales'), $scope.reg).then(function (res) {
                var date = moment();
                var j = 1;
                var tipcambio = 3;
                var mes= date.format('MM');

                res.data.forEach(function (row) {
                     var date2 = moment(row.cfeccom);
                    //var ctotal = $filter('number')(row.ctotal/1.18, 2);rounded.toFixed(1)
                    var ctotal = row.ctotal/1.18;
                    var gato = ctotal.toFixed(2);
                    var igv = $filter('number')(row.igv,2);
                    var detail = [['0001','121201',row.ctotal,'D','C',row.id_number,date2.format('YYMMDD'),date2.format('D-MMM-YY')],['0002','401111',igv,'H','','','',''],['0003','701111',gato ,'H','','','','']];
                    
                    var i = 2;
                    var correlativo = $filter('zeroFill')(j, 4);

                    console.log(detail);
                        
                    if(row.regime == 'General'){
                       
                       
                        //var correlativo = ("0000" + j).slice(-4);
                       

                        for (var i; i >= 0; i--) {
                        
                        //for (var a in row){
                            //console.log(row[a]);
                            //console.log(row.regime);
                            //console.log(row);
                            var dsu = detail[i][2] / tipcambio;
                            dsu = dsu.toFixed(2);
                             $scope.data.push({
                                DSUBDIA: row.cssubdia,
                                CCOMPRO: mes + correlativo,
                                DSECUE:  detail[i][0],
                                DFECCOM: date2.format('YYMMDD'),
                                DCUENTA: detail[i][1],
                                DCODANE: detail[i][5],
                                DCENCOS: '',
                                DCODMON: 'MN',
                                DDH: detail[i][3],
                                DIMPORT: detail[i][2],
                                DTIPDOC: row.voucher,
                                DNUMDOC: row.ccompro,
                                DFECDOC: date2.format('YYMMDD'),
                                DFECVEN: detail[i][6],
                                DAREA: '',
                                DFLAG: 'S',
                                DDATE: date.format('D-MMM-YY'),
                                DXGLOSA: 'Venta de mercaderia',//row.cglosa,
                                DUSIMPOR: dsu,
                                DMNIMPOR: detail[i][2],
                                DCODARC: '',
                                DFECCOM2: date2.format('D-MMM-YY'),
                                DFECDOC2: date2.format('D-MMM-YY'),
                                DFECVEN2: detail[i][7],
                                DCODANE2: '',
                                DVANEXO: detail[i][4],
                                DVANEXO2: '',
                                DTIPCAM:  '',
                                DCANTID:  '',
                                DRETE:    '',
                                DPORRE:   '',
                                DTIPDOR:  '',
                                DNUMPOR:  '',
                                DFECDO2:  '',
                                DTIPTAS:  '',
                                DIMPTAS:  '',
                                DIMPBMN:  '',
                                DIMPBUS:  '',
                                DINACOM:  '',
                                DIGVCOM:  '',
                                DMEDPAG:  '',
                                DMONCOM:  '',
                                DCOLCOM:  '',
                                DBASCOM:  '',
                                DTPCONV:  '',
                                DFLGCOM:  '',
                                DTIPACO:  '',
                                DANECOM:  ''

                            });
                        };
                      
                    }else{

                        for (var i; i >= 0; i--) {
                        
                             $scope.data.push({
                                DSUBDIA: row.cssubdia,
                                CCOMPRO: mes + correlativo,
                                DSECUE:  detail[i][0],
                                DFECCOM: date2.format('YYMMDD'),
                                DCUENTA: detail[i][1],
                                DCODANE: detail[i][5],
                                DCENCOS: '',
                                DCODMON: 'MN',
                                DDH: detail[i][3],
                                DIMPORT: detail[i][2],
                                DTIPDOC: 'TK',
                                DNUMDOC: row.ccompro,
                                DFECDOC: date2.format('YYMMDD'),
                                DFECVEN: detail[i][6],
                                DAREA: '',
                                DFLAG: 'S',
                                DDATE: date.format('D-MMM-YY'),
                                DXGLOSA: 'Venta de mercaderia',//row.cglosa,
                                DUSIMPOR: $filter('number')(detail[i][2] / tipcambio,2),
                                DMNIMPOR: detail[i][2],
                                DCODARC: '',
                                DFECCOM2: date2.format('D-MMM-YY'),
                                DFECDOC2: date2.format('D-MMM-YY'),
                                DFECVEN2: detail[i][7],
                                DCODANE2: '',
                                DVANEXO: detail[i][4],
                                DVANEXO2: '',
                                DTIPCAM:  '',
                                DCANTID:  '',
                                DRETE:    '',
                                DPORRE:   '',
                                DTIPDOR:  '',
                                DNUMPOR:  '',
                                DFECDO2:  '',
                                DTIPTAS:  '',
                                DIMPTAS:  '',
                                DIMPBMN:  '',
                                DIMPBUS:  '',
                                DINACOM:  '',
                                DIGVCOM:  '',
                                DMEDPAG:  '',
                                DMONCOM:  '',
                                DCOLCOM:  '',
                                DBASCOM:  '',
                                DTPCONV:  '',
                                DFLGCOM:  '',
                                DTIPACO:  '',
                                DANECOM:  ''
                                    
                            });
                        };
                    }
                    j=j+1;
                });
            });
        };

        $scope.exportDBF = function (fileName) {
            var dataDBF = $scope.data.slice(0);
            var dateTime = new Date() .getTime();

            dataDBF.forEach(function (row) {
                delete row.$$hashKey; // Eliminamos el hash que crea Angular

                //row.ADATE = dateTime;
            });

            var dataView = dbf.structure(dataDBF);

            FileHandler.download(new Blob([dataView], {type: 'application/x-dbf'}), fileName + '.dbf');
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
            var ws_name = "ASIENTO";

            data.push($scope.labels);

            $scope.data.forEach(function (row) {
                data.push([
                    row.DSUBDIA,
                    row.CCOMPRO,
    				row.CFECCOM,
    				row.CCODMON,
    				row.CSITUA,
    				row.CTIPCAM,
    				row.CGLOSA,
    				row.CTOTAL,
    				row.CTIPO,
    				row.CFLAG,
    				row.CDATE,
    				row.CHORA,
    				row.CUSER,
    				row.CFECCAM,
    				row.CORIG,
    				row.CFORMO,
    				row.CTIPCOM,
    				row.CEXTOR,
    				row.CEFCCOM2,
    				row.CFECCAM2,
    				row.COPCION
                ]);
            });
             
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
             
            /* Agregar la hoja al libro */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

            FileHandler.download(new Blob([s2ab(wbout)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'Registro-ventas.xlsx');
        };
        
    }
]);