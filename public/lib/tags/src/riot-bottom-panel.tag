<riot-bottom-panel>
	<footer class="footer bg-white b-t b-light no-padder">
		<div class="row">
			<div each="{ panels }" class="col-lg-{ parent.size } f16">
				<i if="{ icon }" class="{ icon } v-middle"></i>
				{ text }
			</div>
		</div>
	</footer>

	<style scoped>
		:scope {
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
		}

		footer {
			font-size: 8px;
			min-height: auto !important;
		}

		.row {
			display: inline;
		}

		.row > div {
			font-size: 13px;
		}
	</style>

	<script>
		var self = this

		self.panels = self.opts.panels
		self.size = parseInt(12 / self.opts.panels.length, 10)
	</script>
</riot-bottom-panel>
