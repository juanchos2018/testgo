window.angular.module('ERP').factory('SunatTables', [
  function () {
    var _data = new Map();

    var SunatTables = {
      getCode,
      init
    };

    return SunatTables;

    function finder(value) {
      return function (item) {
        return item.description.toUpperCase() === value.toUpperCase();
      };
    }

    function getCode(number, description) {
      var _description = description.toUpperCase();

      if (number === 10) {
        switch (_description) {
          case 'TICKET':
            description = 'Ticket o cinta emitido por máquina registradora';
            break;
          case 'BOLETA':
            description = 'Boleta de Venta';
            break;
          case 'NOTA DE CREDITO':
            description = 'Nota de crédito';
            break;
          case 'GUIA REMITENTE':
          case 'GUÍA REMITENTE':
            description = 'Guía de remisión - Remitente';
            break;
        }
      } else if (number === 12) {
        switch (_description) {
          case 'CONSIGNACION RECIBIDA':
            description = 'CONSIGNACIÓN RECIBIDA';
            break;
          case 'CONSIGNACION ENTREGADA':
            description = 'CONSIGNACIÓN ENTREGADA';
            break;
          case 'DEVOLUCION':
          case 'DEVOLUCIÓN':
            description = 'DEVOLUCIÓN RECIBIDA';
            break;
          case 'TRASLADO':
            description = 'TRANSFERENCIA ENTRE ALMACENES';
            break;
        }
      }

      var table = _data.get(number);

      if (table) {
        var found = table.find(finder(description));

        if (found !== undefined) {
          return found.code;
        }
      }

      return null;
    }

    function init(data) {
      data.forEach(function (table) {
        _data.set(parseInt(table.id, 10), JSON.parse(table.items));
      });
    }
  }
]);
