<riot-dropdown>
	<div class="dropdown">
		<a href="#" data-toggle="dropdown" role="button">
			{ opts.label }
			<span class="caret"></span>
		</a>

		<ul class="dropdown-menu dropdown-menu-right">
			<li each="{ opts.items }" class="{ divider: type === 'separator' }">
				<a if="{ type !== 'separator' }" href="#" onclick="{ parent.action }">
					<i class="fa fa-fw text-left { fa-check: checked }"></i>
					{ text }
				</a>
			</li>
		</ul>
	</div>

	<script>
		action(e) {
			if (e.item.action) {
				e.item.action.call(e.target, e.item)
			}
		}
	</script>
</riot-dropdown>
