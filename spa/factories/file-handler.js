window.angular.module('ERP').factory('FileHandler', [
	'$window', '$timeout',
	function ($window, $timeout) {
	    var $ = $window.angular.element, FileHandler = {};

		FileHandler.get = function (url, type) {
			return new Promise(function (resolve, reject) {
		    	var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = type || 'blob';

				xhr.onreadystatechange = function () {
					if (xhr.readyState === xhr.DONE) {
						resolve(xhr.response);
					}
				};

				xhr.ontimeout = function () {
					reject('timeout');
				};

				xhr.send();
			});
	    };

	    FileHandler.download = function (blob, name) {
        if (!(blob instanceof Blob)) {
          blob = new Blob(["\ufeff", blob]);
        }

	    	var url = $window.URL.createObjectURL(blob);

  			$('<a href="' + url + '" target="_blank" class="hide" download="' + name + '"></a>').appendTo($window.document.body).get(0).click();

  			$timeout(function () {
  				$window.URL.revokeObjectURL(url);
  			}, 1000);
	    };

		FileHandler.toArrayBuffer = function (file) {
			return new Promise(function (resolve, reject) {
				if (file instanceof Blob) {
					var reader = new FileReader();

					reader.onload = function() {
						resolve(this.result);
					};

					reader.readAsArrayBuffer(file);
				}
			});
		};

		FileHandler.toBinaryString = function (file) {
			return new Promise(function (resolve, reject) {
				if (file instanceof Blob) {
					var reader = new FileReader();

					reader.onload = function() {
						resolve(this.result);
					};

					reader.readAsBinaryString(file);
				}
			});
		};

	    return FileHandler;
	}
]);
