;(function () {
  'use strict';

  var app = angular.module('job-desk', [
    'LocalStorageModule',
    'tmh.dynamicLocale',
    'ui.router',
    'ui.router.stateHelper',
    'ui.bootstrap-slider',
    'ngResource',
    'ngSanitize',
    'ngCookies',
    'ngFlowtype',
    'ngMaterial',
    'ngLodash',
    'pascalprecht.translate',
    'ngCacheBuster',
    'geolocation',
    'alv-ch-ng.core',
    'alv-ch-ng.security',
    'alv-ch-ng.text-truncate',
    'job-desk.i18n',
    'job-desk.directive'
  ]);

  app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['If-Modified-Since'] = '01 Jan 1970 00:00:00 GMT';
  }]);

  app.config(function ($stateProvider, $urlRouterProvider, httpRequestInterceptorCacheBusterProvider, SecurityConfigProvider, $mdThemingProvider) {

    SecurityConfigProvider.setClientId('job-desk');
    SecurityConfigProvider.setClientSecret('job-deskSecret');


    //Cache everything except rest api requests
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/, /.*protected.*/], true);

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('site', {
      'abstract': true
    });

    $mdThemingProvider.theme('jobs').primaryPalette('blue').accentPalette('blue-grey');

    $mdThemingProvider.theme('educations').primaryPalette('orange').accentPalette('blue-grey');

    $mdThemingProvider.theme('apprenticeships').primaryPalette('light-green').accentPalette('blue-grey');

    $mdThemingProvider.setDefaultTheme('jobs');
  });

  app.config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        parent: 'site',
        url: '/error',
        data: {
          roles: [],
          hidden: true
        },
        views: {
          'content@': {
            templateUrl: 'views/content/error/error.html'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
            $translatePartialLoader.addPart('errors');
            return $translate.refresh();
          }]
        },
        hidden: true
      })
      .state('frontpage', {
        parent: 'site',
        url: '/frontpage',
        views: {
          'content@': {
            templateUrl: 'views/content/localInfo/localInfo.html'
          }
        }
      });
  });

  app.run(function($http, geolocation, $rootScope, $state){

    $rootScope.current=function(){
      if ($state.$current.url.source==='/' || $state.$current.url.source==='/jobs' || $state.$current.url.source==='/apprenticeships' || $state.$current.url.source==='/educations'){
        return 'info_outline';
      }
      return 'keyboard_arrow_left';
    };

    geolocation.getLocation().then(function(data){
      $rootScope.myCoords = {lat:data.coords.latitude, lon:data.coords.longitude};
    });

    $rootScope.back=function(){
      if ($state.$current.url.source==='/' || $state.$current.url.source==='/jobs' || $state.$current.url.source==='/apprenticeships' || $state.$current.url.source==='/educations'){
        $state.go('localInfo');
      }
      // Jobs
      else if ($state.$current.url.source==='/job-search'){
        $state.go('jobs');
      }
      else if ($state.$current.url.source==='/job-results'){
        $state.go('job-search');
      }
      // Apprenticeship
      else if ($state.$current.url.source==='/apprenticeship-search'){
        $state.go('apprenticeships');
      }
      else if ($state.$current.url.source==='/apprenticeship-results'){
        $state.go('apprenticeship-search');
      }
    };
  });

}());
