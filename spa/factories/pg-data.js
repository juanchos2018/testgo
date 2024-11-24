window.angular.module('ERP').factory('PgData', [
	function () {
    var PgData = {toArray};
    
    return PgData;

    function toArray(data) { // returns Array
      var regex = /^{(.+)}$/;

      if (regex.test(data)) {
        var matches = data.match(regex);

        if (matches.length === 2) { // OJO: podría dar problemas en arrays anidados
          return matches[1].split(',');
        }
      }

      return [];
    }
  }
]);
