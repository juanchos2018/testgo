/*
 * Xlsx Template
 * Author: Jhon Klever
 * Website: https://github.com/elfoxero/
 * License: http://www.gnu.org/licenses/
 */

var XlsxTemplate = function (file, options) {
	var self = this, libPathTag = document.querySelector('[data-lib-path]'), workerPathTag = document.querySelector('[data-worker-path]');

	options = options || {};

	self.options = {
		autoClose: false,
		expandRange: true,
		libPath: (libPathTag && libPathTag.dataset.libPath) || './lib',
		workerPath: (workerPathTag && workerPathTag.dataset.workerPath) || '.'
	};

	self.events = {};
	self.generated = null;

	Object.keys(options).forEach(function (key) {
		self.options[key] = options[key];
	});

	self.worker = new Worker(self.options.workerPath + '/worker.js');

	self.worker.postMessage( ['options', {
		libPath: self.options.libPath,
		expandRange: self.options.expandRange
	}] );

	// file is arraybuffer
	self.worker.postMessage(file, [file]);

	self.worker.onmessage = function (event) {
		var message = event.data;

		if (message.constructor.name === 'Blob') {
			//console.log('Archivo recibido', message);
			self.generated = message;

			self.trigger('build', self.generated);

			if (self.options.autoClose) {
				self.worker.terminate();
			}
		}
	};
};

XlsxTemplate.prototype.setOption = function (option, value) {
	this.options[option] = value;
};

XlsxTemplate.prototype.putData = function (data, range, callback) {
	var options = {
		range: range
	};

	if (typeof callback === 'function') {
		options.callback = callback.toString();
	} else if (typeof callback === 'string') {
		options.callback = callback;
	}

	this.worker.postMessage( ['data', data, options] );
};

XlsxTemplate.prototype.build = function () {
	this.worker.postMessage('build');
};

XlsxTemplate.prototype.download = function (filename) {
	if (this.generated) {
		filename = filename || 'generated.xlsx';

		if ('msSaveBlob' in navigator) {
			navigator.msSaveBlob(this.generated, filename);
		} else {
			var fileURL = URL.createObjectURL(this.generated);
			var anchor = document.createElement('a');

			anchor.style.display = 'none';
			anchor.href = fileURL;
			anchor.download = filename;

			document.body.appendChild(anchor);

			anchor.click();
		}

		/*setTimeout(function () {
    		URL.revokeObjectURL(fileURL);
    		document.body.removeChild(anchor);
    	}, 500);*/
	}
};

XlsxTemplate.prototype.on = function (event, callback) {
	if ( ! (event in this.events) ) {
		this.events[event] = [];
	}

	this.events[event].push(callback);
};

XlsxTemplate.prototype.trigger = function (event, data) {
	if (event in this.events) {
		this.events[event].forEach(function (callback) {
			callback.call(this, data);
		});
	}
};
