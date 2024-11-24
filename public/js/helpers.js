function enableFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}

function toggleFullscreen() {
	var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;

	if (fullscreenEnabled) {
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			enableFullscreen(document.documentElement);
		} else {
			exitFullscreen();
		}
	}
}

function refreshPage(e) {
	if (e.ctrlKey) {
		window.angular.element('body').scope().reloadPage();
	} else if ('reloadIgnoringCache' in window) {
		window.reloadIgnoringCache();
	} else {
		document.location.reload();
	}

	e.preventDefault();
}

function escapeHtml(str) {
	if (str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	} else {
		return '';
	}
}

function checkPrecision(num, decimals) {
	decimals = decimals || 6;

	if (typeof num === 'number') {
		return (Math.abs(num - Math.trunc(num)) > 0 ? parseFloat(num.toFixed(decimals)) : num);
	} else {
		return parseFloat(num);
	}
}

if (!('repeat' in String.prototype)) {
	String.prototype.repeat = function (num) {
	    return new Array(num + 1).join(this);
	};
}


if (!('zeros' in String.prototype)) {
	String.prototype.zeros = function (num) {
		var repeated = '0'.repeat(num);
	    return (repeated + this).slice(-num);
	};
}

if (!('capitalize' in String.prototype)) {
	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	};
}

if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

if (!('toDate' in String.prototype)) {
	String.prototype.toDate = function () {
		var self = this;

		if (self.length) {
			if (self.indexOf(' ') >= 0) {
	            return Date.parse(self.split(' ').join('T') + '-0500'); // En Perú la hora siempre es GMT-5
	        } else {
	        	return Date.parse(self);
	        }
		}

		return 0;
	};
}

if (!('toPgDate' in String.prototype)) {
	// Transformar de DD/MM/YYYY a YYYY-MM-DD para guardar en PostgreSQL
	String.prototype.toPgDate = function () {
		var self = this;

		if (self.length && self.split('/').length === 3) {
			return self.split('/').reverse().join('-');
		}

		return self;
	};
}

if ( !('extendEach' in Array.prototype) ) {
	Array.prototype.extendEach = function (props) {
		return this.map(function (e) {
			Object.keys(props).forEach(function (prop) {
				e[prop] = props[prop];
			});

			return e;
		});
	};
}

if ( !('unique' in Array.prototype) ) {
	Array.prototype.unique = function (){
	    return this.filter(function(el, index, arr) {
	        return index === arr.indexOf(el);
	    });
	};
}

if (Array.prototype.sumBy === undefined) {
  Array.prototype.sumBy = function (prop, initial = 0) {
    return Array.prototype.reduce.call(this, function (accum, current) {
      if (prop in current) {
        return accum + Number(current[prop]);
      } else {
        return accum;
      }
    }, initial);
  };
}

FormData.prototype.set = function (data) {
    var me = this;

    Object.keys(data).forEach(function (key) {
		if (data[key].constructor.name === 'Array') {
			data[key].forEach(function (arrVal, index) {
				if (typeof arrVal === 'object') {
					Object.keys(arrVal).forEach(function (objKey) {
						me.append(key + '[' + index + '][' + objKey + ']', arrVal[objKey]);
					});
				} else {
					me.append(key + '[]', arrVal);
				}
			});
		} else {
        	me.append(key, data[key]);
		}
    });

    return me;
};

var formatNumber = {
	separador: ".", // separador para los miles
	sepDecimal: ',', // separador para los decimales
 	formatear:function (num){
 		num +='';
		var splitStr = num.split(',');
		var splitLeft = splitStr[0];
		var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
		var regx = /(\d+)(\d{3})/;
		while (regx.test(splitLeft)) {
			splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
		}
		return this.simbol + splitLeft  +splitRight;
 	},
 	new:function(num, simbol){
 		this.simbol = simbol ||' ';
 		return this.formatear(num);
 	}
};

var Notification = window.Notification || window.mozNotification || window.webkitNotification;

/*
	backgroundXHR ejecuta una petición XHR en un proceso aparte (como Worker)
	y devuelve una promesa (new Promise).
*/
var backgroundXHR = (function () {
	var worker = new Worker(window.baseUrl('public/js/workers/xhr.js'));

	return function (url, data, opts) {
		worker.postMessage({
			url: url,
			data: data,
			opts: opts
		});

		return new Promise(function (resolve, reject) {
			worker.onmessage = function (e) {
				if ('error' in e.data) {
					reject(e.data);
				} else {
					resolve(e.data.response || '');
				}
			};

			worker.onerror = function (error) {
				reject(error);
			};
		});

	};
})();

var xlsxHelpers = {
	s2ab: function (s) {
		var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
		for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
		return [v, b];
	},
	ab2str: function (data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
		return o;
	}
};

/* Esto hará funcionar select2 v4 dentro de los modales */
window.jQuery.fn.modal.Constructor.prototype.enforceFocus = function() {};

var numeroALetras = (function() {
			function Unidades(num){
	
					switch(num)
					{
							case 1: return 'UN';
							case 2: return 'DOS';
							case 3: return 'TRES';
							case 4: return 'CUATRO';
							case 5: return 'CINCO';
							case 6: return 'SEIS';
							case 7: return 'SIETE';
							case 8: return 'OCHO';
							case 9: return 'NUEVE';
					}
	
					return '';
			}//Unidades()
	
			function Decenas(num){
	
					var decena = Math.floor(num/10);
					var unidad = num - (decena * 10);
	
					switch(decena)
					{
							case 1:
									switch(unidad)
									{
											case 0: return 'DIEZ';
											case 1: return 'ONCE';
											case 2: return 'DOCE';
											case 3: return 'TRECE';
											case 4: return 'CATORCE';
											case 5: return 'QUINCE';
											default: return 'DIECI' + Unidades(unidad);
									}
							case 2:
									switch(unidad)
									{
											case 0: return 'VEINTE';
											default: return 'VEINTI' + Unidades(unidad);
									}
							case 3: return DecenasY('TREINTA', unidad);
							case 4: return DecenasY('CUARENTA', unidad);
							case 5: return DecenasY('CINCUENTA', unidad);
							case 6: return DecenasY('SESENTA', unidad);
							case 7: return DecenasY('SETENTA', unidad);
							case 8: return DecenasY('OCHENTA', unidad);
							case 9: return DecenasY('NOVENTA', unidad);
							case 0: return Unidades(unidad);
					}
			}//Unidades()
	
			function DecenasY(strSin, numUnidades) {
					if (numUnidades > 0)
							return strSin + ' Y ' + Unidades(numUnidades);
	
					return strSin;
			}//DecenasY()
	
			function Centenas(num) {
					var centenas = Math.floor(num / 100);
					var decenas = num - (centenas * 100);
	
					switch(centenas)
					{
							case 1:
									if (decenas > 0)
											return 'CIENTO ' + Decenas(decenas);
									return 'CIEN';
							case 2: return 'DOSCIENTOS ' + Decenas(decenas);
							case 3: return 'TRESCIENTOS ' + Decenas(decenas);
							case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
							case 5: return 'QUINIENTOS ' + Decenas(decenas);
							case 6: return 'SEISCIENTOS ' + Decenas(decenas);
							case 7: return 'SETECIENTOS ' + Decenas(decenas);
							case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
							case 9: return 'NOVECIENTOS ' + Decenas(decenas);
					}
	
					return Decenas(decenas);
			}//Centenas()
	
			function Seccion(num, divisor, strSingular, strPlural) {
					var cientos = Math.floor(num / divisor);
					var resto = num - (cientos * divisor);
	
					var letras = '';
	
					if (cientos > 0)
							if (cientos > 1)
									letras = Centenas(cientos) + ' ' + strPlural;
							else
									letras = strSingular;
	
					if (resto > 0)
							letras += '';
	
					return letras;
			}//Seccion()
	
			function Miles(num) {
					var divisor = 1000;
					var cientos = Math.floor(num / divisor);
					var resto = num - (cientos * divisor);
	
					var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
					var strCentenas = Centenas(resto);
	
					if(strMiles == '')
							return strCentenas;
	
					return strMiles + ' ' + strCentenas;
			}//Miles()
	
			function Millones(num) {
					var divisor = 1000000;
					var cientos = Math.floor(num / divisor);
					var resto = num - (cientos * divisor);
	
					var strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
					var strMiles = Miles(resto);
	
					if(strMillones == '')
							return strMiles;
	
					return strMillones + ' ' + strMiles;
			}//Millones()
	
			return function NumeroALetras(num, currency) {
					currency = currency || {};
					var data = {
							numero: num,
							enteros: Math.floor(num),
							centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
							letrasCentavos: '',
							letrasMonedaPlural: currency.plural || 'PESOS CHILENOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
							letrasMonedaSingular: currency.singular || 'PESO CHILENO', //'PESO', 'Dólar', 'Bolivar', 'etc'
							letrasMonedaCentavoPlural: currency.centPlural || 'CHIQUI PESOS CHILENOS',
							letrasMonedaCentavoSingular: currency.centSingular || 'CHIQUI PESO CHILENO'
					};
	
					if (data.centavos > 0) {
							data.letrasCentavos = 'Y ' + (function () {
											if (data.centavos > 9)
													return data.centavos + '/100 ' + data.letrasMonedaPlural;
											else
													return '00' + data.centavos + '/100' + data.letrasMonedaPlural;
									})();
					};
	
					if(data.enteros == 0)
							return 'CERO ' +  data.letrasCentavos;
					if (data.enteros == 1)
							return Millones(data.enteros) + ' Y 00/100 ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
					else
							return Millones(data.enteros) + ' Y 00/100 ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
			};
	
	})();
	