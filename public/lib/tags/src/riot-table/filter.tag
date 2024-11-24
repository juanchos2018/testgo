<filter>
	<yield/>

	<script>
		var self = this
		var parent = self.parent
		
		self.term = self.opts.term
		self.query = ''

		self.on('mount', function () {
			self.root.querySelector('select').onchange = function (e) {
				self.query = e.target.value

				if ( parent.remote ) {
					parent.load({ page: 1 })
				} else {
					parent.filtered.length = 0

					if ( !self.query.length ) {
						parent.filtered = parent.original.slice(0)
					} else {
						parent.original.forEach(function (item) {
							if (item[self.term] === self.query) {
								parent.filtered.push(item)
							}
						})
					}
				}

				parent.start = 0
				/*parent.update({
					updatePaginator: true
				})*/
				parent.updateAndPaginator({ page: 1 })
			}
		});
	</script>
</filter>
