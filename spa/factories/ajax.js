window.angular.module('ERP').factory('Ajax', [
  '$http', '$window', '$location', 'Session',
  function ($http, $window, $location, Session) {
    var Ajax = {
      post: function (url, data) {
        if (data.constructor === FormData) {
          return $http.post(url, data, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
          });
        } else {
          return $http.post(url, $.param(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
        }
      },
      postData: function (url, data, path, successMsg, errorMsg) {
        return new Promise(function (resolve, reject) {
          Ajax.post(url, data).then(function (res) {
            if (res.data && typeof res.data === 'object') {
              if (res.data.ok) {
                if (successMsg) {
                  if (path) {
                    Session.setMessage(successMsg);
                    $location.path(path);
                  } else {
                    Session.setMessage(successMsg, 'success', true);
                  }
                }

                resolve(res.data);
              } else {
                if (errorMsg) {
                  Session.setMessage(errorMsg, 'danger', true);
                }

                if (res.data.error) {
                  reject(res.data.error);
                } else {
                  reject();
                }
              }
            } else {
              if (errorMsg) {
                Session.setMessage(errorMsg, 'danger', true);
              }

              if (res.data) {
                reject(res.data);
              } else {
                reject();
              }
            }
          }, function (reason) {
            if (errorMsg) {
              Session.setMessage(errorMsg, 'danger', true);
            }

            if (reason && reason.statusText) {
              reject(reason.statusText);
            } else if (reason) {
              reject(reason);
            } else {
              reject();
            }
          });
        });

      },
      get: function (url) {
        return $http.get(url);
      },
      getData: function (url) {
        return $http.get(url).then(function (res) {
          return res.data;
        });
      },
      data: function () { // Devuelve un FormData
        var formData = new FormData();

        for (var i = 0; i < arguments.length; i++) {
          formData.set(arguments[i]);
        }

        return formData;
      }
    };

    return Ajax;
  }
]);
