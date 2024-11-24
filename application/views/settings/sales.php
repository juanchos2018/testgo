<section class="wrapper">
    <form class="m-b-lg" ng-submit="save()" autocomplete="off">
        <div class="panel panel-default">
            <div class="panel-heading">
                Ticket de venta
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group m-b-none">
                            <label>Mensaje personalizado</label>
                            
                            <textarea class="form-control" ng-model="saleTicketMessage"></textarea>
                        </div>
                    </div>
                    <div class="col-md-12 m-t">
                        <div class="form-group m-b-none">
                            <label>Mensaje de devolución</label>
                            
                            <textarea class="form-control" ng-model="returnTicketMessage"></textarea>
                        </div>
                    </div>
                    <div class="col-md-2 m-t">
                        <div class="form-group m-b-none">
                            <label>Mensaje de Promoción</label>
                            
                            <select class="form-control m-r" ng-model="promoTicketStatus">
                                <option value="0" >Desactivado</option>
                                <option value="1" >Activado</option>
                            </select>
                        </div>
                    </div>
                </div>
              
        </div>
        <div class="text-center">
            <button type="submit" class="btn btn-success">Guardar</button>
        </div>
    </form>
</section>
<script>
    angularScope(['$scope', 'Settings', function ($scope, Settings) {
        $scope.saleTicketMessage = Settings.getItem('sale_ticket_message', 'text');
        $scope.returnTicketMessage = Settings.getItem('return_ticket_message', 'text');
        $scope.promoTicketStatus = Settings.getItem('promo_ticket_status', 'numeric');
    }]);
</script>