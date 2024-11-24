var self = this;
var storage = {};

self.onmessage = function (event) {
	var args = event.data;
	var request = new XMLHttpRequest();

	request.open(args.data ? 'post' : 'get', args.url);
	args.opts && args.opts.responseType && (request.responseType = args.opts.responseType);

	if (args.opts && args.opts.id) {
		if (args.opts.id in storage && storage[args.opts.id].constructor.name === 'XMLHttpRequest') {
			storage[args.opts.id].abort();
			console.warn('Cancelando XHR anterior');
		}

		request.addEventListener('load', function () {
			storage[args.opts.id] = null;
			delete storage[args.opts.id];
		});

		request.addEventListener('error', function () {
			storage[args.opts.id] = null;
			delete storage[args.opts.id];
		});

		storage[args.opts.id] = request;
	}

	request.addEventListener('load', function () {
		if (this.status === 200) {
			self.postMessage({ok: true, response: this.response});
		} else {
			self.postMessage({error: true, status: this.status, statusText: this.statusText});
		}
	});

	request.addEventListener('error', function (err) {
		self.postMessage({error: true, status: err.target.status, statusText: err.target.statusText});
	});

	request.send(args.data || null);
};