<riot-rdata-paginator>
  <ul class="pagination m-t-none m-b-none">
    <li class="page-item" title="Primera página">
      <a class="page-link" href="#" onclick="{ parent.first }">«</a>
    </li>
    <li class="page-item" title="Página anterior">
      <a class="page-link" href="#" onclick="{ parent.prev }">←</a>
    </li>
    <virtual each="{ page in parent.pages }">
      <li if="{ !isNaN(page) }" class="page-item { parent.parent.isCurrent(page) ? 'active' : '' }">
        <a class="page-link" href="#" onclick="{ parent.parent.go }">{ page }</a>
      </li>
      <li if="{ isNaN(page) }" class="page-item disabled">
        <a class="page-link" tabindex="-1">...</a>
      </li>
    </virtual>
    <li class="page-item" title="Página siguiente">
      <a class="page-link" href="#" onclick="{ parent.next }">→</a>
    </li>
    <li class="page-item" title="Última página">
      <a class="page-link" href="#" onclick="{ parent.last }">»</a>
    </li>
  </ul>
</riot-rdata-paginator>
