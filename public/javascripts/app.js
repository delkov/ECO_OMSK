console.log('downloaded..')

angular.module('movieApp',['moment-picker', 'ui.router','ngResource','movieApp.controllers','movieApp.services']);

angular.module('movieApp').config(function($stateProvider,$httpProvider,$locationProvider){
    $stateProvider.state('movies',{
        url:'/movies',
        templateUrl:'partials/movies.html',
        controller:'MovieListController'
    }).state('noise',{
        url:'/noise',
        templateUrl:'partials/noise.html',
        controller:'NoiseController'
    }).state('tracks',{
        url:'/tracks',
        templateUrl:'partials/tracks.html',
        controller:'TracksController'
    }).state('stats',{
        url:'/stats',
        templateUrl:'partials/stats.html',
        controller:'StatsController'
    });

    // $locationProvider.html5Mode(true); // History API

}).run(function($state){
   $state.go('movies');
});


// to fix some error because of wrong version
angular.module('movieApp').config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

