window.angular.module('ERP').factory('Requester', [
	'$timeout', 'Ajax', '_riot', '_URI',
	function ($timeout, Ajax, riot, URI) {
    var defaultOpts = {
      delay: 0,
      display: 1000
    }

    var Requester = {getArray, getObject};

    riot.observable(Requester);
    
    return Requester;

    function getArray(sources, opts) {
      return new Promise(function (res, rej) {
        var result = [];

        getData(sources, Object.assign({}, defaultOpts, opts), result, res);
      });
    }

    function getData(sources, opts, result, resolve, sourceIndex = 0) {
      var source = sources[sourceIndex];
      var uri = URI(typeof source === 'string' ? source : source.url);
      var requestedData = [];

      //console.log('options merged', opts);

      if (sourceIndex === 0) {
        Requester.trigger('progress', 0);
      }
      
      Ajax.getData(uri.removeSearch('display').removeSearch('page').addSearch('display', opts.display).addSearch('page', 1).toString()).then(function _callback(data) {
        if (data.items && 'total_count' in data) {
          data.page = parseInt(data.page, 10) || 1;

          var itemsCount = getItemsCount(data, opts);

          if (data.items.length > 0) {
            Array.prototype.push.apply(requestedData, data.items);
          }
          
          if (data.total_count > 0) {
            Requester.trigger('progress', 1 / sources.length * (sourceIndex + itemsCount / data.total_count));
          } else {
            Requester.trigger('progress', 1 / sources.length * (sourceIndex + 1));
          }

          if (itemsCount < data.total_count) {
            Ajax.getData(uri.removeSearch('page').addSearch('page', data.page + 1).toString()).then(_callback);
          } else {
            if (Array.isArray(result)) {
              Array.prototype.push.apply(result, requestedData);
            } else {
              result[source.id || source.url || source] = requestedData;
            }

            $timeout(function () {
              Requester.trigger('completed', sources[sourceIndex]);

              if (sourceIndex + 1 < sources.length) {
                getData(sources, opts, result, resolve, sourceIndex + 1);
              } else {
                resolve(result);
              }
            }, opts.delay);
          }
        } else {
          resolve(result);
        }
      });
    }

    function getItemsCount(data, opts) {
      return (parseInt(data.page, 10) - 1) * opts.display + data.items.length;
    }

    function getObject(sources, opts) {
      return new Promise(function (res, rej) {
        var result = {};

        getData(sources, Object.assign({}, defaultOpts, opts), result, res);
      });
    }
  }
]);
