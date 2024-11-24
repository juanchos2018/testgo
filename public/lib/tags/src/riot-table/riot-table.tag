<riot-table>
	<!--
		RiotTable
		=========
		Author: Jhon Klever
		Website: https://github.com/elfoxero/
		License: http://www.gnu.org/licenses/
	-->

	<yield/>

	<style scoped>
		:scope[data-loading="true"] tbody {
			opacity: .5;
		}
	</style>

	<script>
		var self = this

		self.start = 0
		self.limit = self.opts.limit || 10
		self.remote = (typeof self.opts.data === 'string' || typeof self.opts.data === 'function')

		load(paginator) { // Para datos remotos
			paginator = paginator || {}

			var params = 'start=' + (paginator.page === 1 ? 0 : self.start) + '&limit=' + self.limit
			if ( 'searchbox' in self.tags && self.tags.searchbox.query ) {
				params += '&query=' + encodeURIComponent(self.tags.searchbox.query)
			}

			if ( 'filter' in self.tags ) {
				if ( Array.isArray(self.tags.filter) ) {
					var index = 0

					self.tags.filter.forEach(function (filter) {
						if ( filter.query ) {
							params += '&filter[' + index + '][key]=' + encodeURIComponent(filter.term) + '&filter[' + index + '][value]=' + encodeURIComponent(filter.query)
							index++
						}
					})
				} else if ( self.tags.filter.query ) {
					params += '&filter[key]=' + encodeURIComponent(self.tags.filter.term) + '&filter[value]=' + encodeURIComponent(self.tags.filter.query)
				}
			}

			if (typeof self.url === 'string') {
				self.request && self.request.abort()

				self.request = new XMLHttpRequest()
				self.request.open('get', self.url + '?' + params)
				self.request.responseType = 'json'
				self.request.onload = function () {
					var data = self.request.response

					self.filtered.length = 0
					self.data.length = 0

					self.total = data.shift()
					self.filtered = data
					self.data = self.filtered

					self.loading = false
					self.root.dataset.loading = 'false'
					self.request = null

					self.update()

					if ( 'paginator' in self.tags ) {
						self.tags.paginator.update(paginator)
					}
				}

				self.request.send()
			} else { // self.url es una función
				self.url.call(self, params).then(function (response) {
					self.filtered.length = 0
					self.data.length = 0

					self.total = response.shift()
					self.filtered = response
					self.data = self.filtered

					self.loading = false
					self.root.dataset.loading = 'false'
					self.request = null

					self.update()

					if ( 'paginator' in self.tags ) {
						self.tags.paginator.update(paginator)
					}
				}, function (error) {

				})
			}

			self.loading = true
			self.root.dataset.loading = 'true'
		}

		num(index) {
			if ('paginator' in self.tags) {
				return (self.tags.paginator.page - 1) * self.limit + index + 1
			} else {
				return 0
			}
		}

		updatePaginator(paginator) {
			if ( 'paginator' in self.tags ) {
				self.tags.paginator.update(paginator || {})
			}
		}

		updateAndPaginator(paginator) {
			self.update()
			self.updatePaginator(paginator || {});
		}

		if ( self.remote ) {
			self.url = self.opts.data

			self.original = []
			self.filtered = []
			self.data = []

			self.total = 0

			self.load()
		} else {
			self.original = self.opts.data
			self.filtered = self.original.slice(0)
			self.data = self.filtered.slice(self.start, self.start + self.limit)

			self.total = self.filtered.length
		}

		if (self.opts.hideLoader) {
			self.root.dataset.hideLoader = 'true'
		}

		self.on('update', function (context) {
			context = context || {}

			if ( !self.remote ) {
				if ('data' in context) { // Se actualizan los datos
					self.filtered = self.original.slice(0) // OJO: no se debe considerar todo el original, sino con los filtros y searchbox

					self.tags.paginator.checkPage()

					self.data = self.filtered.slice(self.start, self.start + self.limit)
					self.total = self.filtered.length

					self.updatePaginator()
				} else {
					self.data = self.filtered.slice(self.start, self.start + self.limit)
					self.total = self.filtered.length
				}
			}

			if (typeof self.opts.onupdate === 'function') {
				window.setTimeout(function () {
					self.opts.onupdate.call(self)
				});
			}
		})
	</script>
</riot-table>
