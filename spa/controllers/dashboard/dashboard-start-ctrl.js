var dashboardStart = {};

window.angular.module('ERP').controller('DashboardStartCtrl', [
  '$scope', 'Page', 'Auth',
  function ($scope, Page, Auth) {
    Page.title('Inicio');

    $scope.twitter_id = 'LfaSportsTacna';
    $scope.facebook_id = 'lfasport';

    dashboardStart.loadFacebook($scope.facebook_id);
    dashboardStart.loadTwitter($scope.twitter_id);

    if (Auth.value('userRoleName') !== 'Operador de Ventas') {
      $scope.monthlyOpts = {
        chart: {
          type: 'pieChart',
          height: 280,
          donut: true,
          x: function (d) { return d.category; },
          y: function (d) { return d.total; },
          showLabels: true,
          labelsOutside: true,
          donutRatio: .5,
          labelType: 'percent',
          showLegend: true,
          objectEquality: true,
          growOnHover: false,
          legend: {
            margin: {
              bottom: 25
            }
          },
          tooltip: {
            enabled: false
          }
        }
      };
    }
  }
]);

dashboardStart.loadFacebook = function (id) {
  var script = document.createElement('script');
  script.src = 'https://graph.facebook.com/' + id + '?callback=dashboardStart.facebookLoaded&fields=engagement,overall_star_rating&access_token=832838693458263|72cQliffbB0Dnontq3PS5HeuJpw';
  script.onload = function () {
    document.body.removeChild(script);
  };
  script.onerror = function () {
    dashboardStart.facebookFailed();
  };
  document.body.appendChild(script);
};

dashboardStart.loadTwitter = function (id) {
  var script = document.createElement('script');
  script.src = '//duckduckgo.com/js/spice/twitter/' + id + '?callback=dashboardStart.twitterLoaded';
  script.onload = function () {
    document.body.removeChild(script);
  };
  script.onerror = function () {
    dashboardStart.twitterFailed();
  };
  document.body.appendChild(script);
};

dashboardStart.facebookLoaded = function (data) {
  if ('engagement' in data && 'count' in data.engagement) {
    var $scope = window.angular.element('[ng-view]').scope();
    
    $scope.likes = data.engagement.count;
    $scope.starRating = data.overall_star_rating;
    
    $scope.$apply();
  } else {
    dashboardStart.facebookFailed();
  }
};

dashboardStart.twitterLoaded = function (data) {
  var $scope = window.angular.element('[ng-view]').scope();
  $scope.followers = data.followers_count;
  $scope.$apply();
};

dashboardStart.facebookFailed = function () {
  var $scope = window.angular.element('[ng-view]').scope();
  $scope.facebookError = true;
  $scope.$apply();
};

dashboardStart.twitterFailed = function () {
  var $scope = window.angular.element('[ng-view]').scope();
  $scope.twitterError = true;
  $scope.$apply();
};
