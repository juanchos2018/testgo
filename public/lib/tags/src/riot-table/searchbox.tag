<searchbox>
	<input type="search" class="{ opts.input_class }" placeholder="{ opts.placeholder }" oninput="{ filter }" />

	<script>
		var self = this
		var parent = self.parent
		var delay = 500

		self.min = self.opts.min || (parent.remote ? 3 : 0)
		self.query = ''
		self.timeout = 0

		filter(e) {
			if ( e.target.value.trim() !== self.query && ( !e.target.value.trim().length || e.target.value.trim().length > self.min ) ) {
				self.query = e.target.value.trim()
				self.timeout && clearTimeout(self.timeout)

				self.timeout = setTimeout(function () {
					if ( parent.remote ) {
						parent.load({ page: 1 })
					} else {
						parent.filtered.length = 0

						if ( !self.query.length ) {
							parent.filtered = parent.original.slice(0)
						} else {
							parent.original.forEach(function (item) {
								var keys = Object.keys(item);

								for ( var i = 0; i < keys.length; i++ ) {
									if ( item[keys[i]] && new RegExp(self.query, 'i') .test(item[keys[i]].toString()) ) {
										parent.filtered.push(item)
										break
									}
								}
							})
						}
					}
					
					self.timeout = 0

					parent.start = 0
					/*parent.update({
						updatePaginator: true
					})*/
					parent.updateAndPaginator({ page: 1 })
				}, delay)

			}
		}
	</script>
</searchbox>
