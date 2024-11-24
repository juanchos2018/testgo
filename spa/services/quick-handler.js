window.angular.module('ERP').service('QuickHandler', [
	'$window', '$templateCache', '$location', 'Ajax',
	function ($window, $templateCache, $location, Ajax) {
		var self = this;

		this.controller = '';
		this.redirectPath = '';

		this.indexUrl = '';
		this.processUrl = '';

		this.init = function (controller, redirectPath) {
			this.controller = controller || '';
			this.redirectPath = redirectPath || '';
		};

		this.setUrls = function (indexUrl, processUrl) {
			this.indexUrl = indexUrl || '';
			this.processUrl = processUrl || '';
			console.log('QuickHandler: processUrl', this.processUrl);
		};

		this.save = function (data, success, failure) {
			Ajax.post($window.siteUrl(this.processUrl), data).then(function (res) {
				console.log('res.data', res.data);

				if (self.indexUrl.constructor.name === 'Array') {
					self.indexUrl.forEach(function (indexUrl) {
	            		$templateCache.remove($window.siteUrl(indexUrl));
					});
				} else if (typeof self.indexUrl === 'string') {
	            	$templateCache.remove($window.siteUrl(self.indexUrl));
				}

	            $location.path(self.redirectPath);
	        }, function (reason) {
	        	console.error('reason', reason);
	            $location.path(self.redirectPath);
	        });
		};

		this.move = function (data, field, filtered, success, failure) {
			if (confirm('¿Está seguro?')) {
				var column = this._column(field, filtered);
				var postData = {};

				this._deleteData(data, field, column);

				postData[field] = column;

				Ajax.post($window.siteUrl(this.processUrl), postData).then(function (res) {
					console.log('res.data', res.data);

					if (self.indexUrl.constructor.name === 'Array') {
						self.indexUrl.forEach(function (indexUrl) {
		            		$templateCache.remove($window.siteUrl(indexUrl));
						});
					} else if (typeof self.indexUrl === 'string') {
		            	$templateCache.remove($window.siteUrl(self.indexUrl));
					}
		        }, function (reason) {
		        	console.error('reason', reason);
		        });
			}
		};

		this._column = function (key, data) {
			var returned = [];

			(data.constructor.name === 'Array') && data.forEach(function (row) {
				(key in row) && returned.push(row[key]);
			});

			return returned;
		};

		this._deleteData = function (data, key, column) {
			(data.constructor.name === 'Array') && data.forEach(function (row, index) {
				if ((key in row) && column.indexOf(row[key]) > -1) {
					console.log('Eliminar: ', row);
					data.splice(index, 1);
				}
			});
		};
	}
]);