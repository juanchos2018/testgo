<paginator>
	<a href="#" class="{ opts.button_class }" onclick="{ firstPage }" data-first>«</a>
	<a href="#" class="{ opts.button_class }" onclick="{ prevPage }">←</a>
		
	<span if="{ !count }">
		<a href="#" class="{ className(1) }" onclick="{ noop }">
			1
		</a>
	</span>
	
	<span if="{ count > 0 && count < 8 }">
		<a each="{ n in pages }" href="#" class="{ parent.className(n) }" onclick="{ parent.setPage }">
			{ n }
		</a>
	</span>
	
	<span if="{ count > 7 }">
		<a href="#" class="{ className(1) }" onclick="{ setPage }">1</a>

		<span if="{ page < 5 }">
			<a href="#" class="{ className(2) }" onclick="{ setPage }">2</a>
			<a href="#" class="{ className(3) }" onclick="{ setPage }">3</a>
			<a href="#" class="{ className(4) }" onclick="{ setPage }">4</a>
			<a href="#" class="{ className(5) }" onclick="{ setPage }">5</a>
		</span>

		<span if="{ page > 4 && page < count - 3 }">
			<label>...</label>
			<a href="#" class="{ className(page - 1) } after-label" onclick="{ setPage }">{ page - 1 }</a>
			<a href="#" class="{ className(page) }" onclick="{ setPage }">{ page }</a>
			<a href="#" class="{ className(page + 1) }" onclick="{ setPage }">{ page + 1 }</a>
		</span>

		<span if="{ page > count - 4 }">
			<label>...</label>
			<a href="#" class="{ className(count - 4) } after-label" onclick="{ setPage }">{ count - 4 }</a>
			<a href="#" class="{ className(count - 3) }" onclick="{ setPage }">{ count - 3 }</a>
			<a href="#" class="{ className(count - 2) }" onclick="{ setPage }">{ count - 2 }</a>
			<a href="#" class="{ className(count - 1) }" onclick="{ setPage }">{ count - 1 }</a>
		</span>

		<span if="{ page < count - 3 }">
			<label>...</label>
		</span>

		<a href="#" class="{ className(count) } { 'after-label': page < count - 3 }" onclick="{ setPage }">{ count }</a>
	</span>

	<a href="#" class="{ opts.button_class }" onclick="{ nextPage }">→</a>
	<a href="#" class="{ opts.button_class }" onclick="{ lastPage }" data-last>»</a>

	<style scoped>
		:scope {
			display: inline;
			float: right;
		}

		a, label {
			display: inline-block;
			float: left;
		}

		label {
			padding-left: 8px;
			padding-right: 8px;
		}

		a:not([data-first]):not([data-last]):not(.after-label) {
			border-left-width: 0 !important;
			border-radius: 0 !important;
		}

		a[data-first] {
			border-top-right-radius: 0 !important;
			border-bottom-right-radius: 0 !important;
		}

		a[data-last] {
			border-left-width: 0 !important;
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
		}

		a.after-label {
			border-radius: 0;
		}
	</style>

	<script>
		var self = this
		var parent = self.parent

		self.page = 1
		self.count = (Math.floor(parent.total / parent.limit) + (parent.total % parent.limit > 0 ? 1 : 0))
		self.pages = [];

		for (var i = 0; i < self.count; i++) {
			self.pages.push(i + 1);
		}

		self.on('update',function () {
			self.count = (Math.floor(parent.total / parent.limit) + (parent.total % parent.limit > 0 ? 1 : 0))

			self.pages.length = 0;

			for (var i = 0; i < self.count; i++) {
				self.pages.push(i + 1);
			}
		})
		
		noop() { }

		className(itemPage) {
			if ( itemPage === self.page ) {
				return self.opts.active_button_class || ''
			} else {
				return self.opts.button_class || ''
			}
		}

		firstPage() {
			self.setPage(1)
		}

		prevPage() {
			if ( self.page > 1 ) {
				self.setPage(self.page - 1)
			}
		}

		nextPage() {
			if ( self.page < self.count ) {
				self.setPage(self.page + 1)
			}
		}

		lastPage() {
			self.setPage(self.count)
		}
		
		checkPage() {
			var total = parent.filtered.length
			
			self.count = (Math.floor(total / parent.limit) + (total % parent.limit > 0 ? 1 : 0))
			
			if (self.page > self.count) {
				self.page = self.count
				parent.start = parent.limit * (self.page - 1)
			}
		}

		setPage(e) {
			var page = (isFinite(e) ? e : parseInt(e.target.textContent));

			if (page !== self.page) {
				self.page = page;
				
				parent.start = parent.limit * (self.page - 1)

				if ( parent.remote ) {
					parent.load()
				} else {
					parent.update()
				}
			}
		}

	</script>
</paginator>