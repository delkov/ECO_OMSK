/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('movieApp.services',[]).factory('Movie',function($resource){
    // return $resource('http://movieapp-13434.onmodulus.net/api/movies/:id',{id:'@_id'},{
    //     update: {
    //         method: 'PUT'
    //     }
    // });
    		// console.log('GETTING')
            // return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/');
            // return $resource('http://localhost:3000/air_data').get();
      return $resource(
      'http://localhost:3000/air_data'
      // { method: 'getTask', q: '*' }, // Query parameters
      // {'query': { method: 'GET' }}
      // {'query': {method: 'GET', isArray: false }}
    );


}).factory('NoiseFactory',function($resource){
    // return $resource('http://movieapp-13434.onmodulus.net/api/movies/:id',{id:'@_id'},{
    //     update: {
    //         method: 'PUT'
    //     }
    // });
        console.log('GETTING NOISE')
            // return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/');
            // return $resource('http://localhost:3000/air_data').get();
    //   return $resource(
    //   'http://localhost:3000/noise_data'
    //   // { method: 'getTask', q: '*' }, // Query parameters
    //   // {'query': { method: 'GET' }}
    //   // {'query': {method: 'GET', isArray: false }}
    // );


      return $resource('http://localhost:3000/noise_data', {method: 'GET'});

}).factory('NoiseFactory_Stats',function($resource){
    // return $resource('http://movieapp-13434.onmodulus.net/api/movies/:id',{id:'@_id'},{
    //     update: {
    //         method: 'PUT'
    //     }
    // });
        console.log('STATS')
            // return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/');
            // return $resource('http://localhost:3000/air_data').get();
    //   return $resource(
    //   'http://localhost:3000/noise_data'
    //   // { method: 'getTask', q: '*' }, // Query parameters
    //   // {'query': { method: 'GET' }}
    //   // {'query': {method: 'GET', isArray: false }}
    // );


      return $resource('http://localhost:3000/Flight_stats', {




        method: 'GET',
        isArray:true,
        transformResponse: function (data) {return data} 



    });



}).factory('NoiseFactory_Table',function($resource){
    // return $resource('http://movieapp-13434.onmodulus.net/api/movies/:id',{id:'@_id'},{
    //     update: {
    //         method: 'PUT'
    //     }
    // });
        console.log('GETTING NOISE2222222222222222222')
            // return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/');
            // return $resource('http://localhost:3000/air_data').get();
    //   return $resource(
    //   'http://localhost:3000/noise_data'
    //   // { method: 'getTask', q: '*' }, // Query parameters
    //   // {'query': { method: 'GET' }}
    //   // {'query': {method: 'GET', isArray: false }}
    // );


      return $resource('http://localhost:3000/noise_data/:level', {method: 'GET'});




})
// .factory('NoiseFactory_Table',function($resource){
//     // return $resource('http://movieapp-13434.onmodulus.net/api/movies/:id',{id:'@_id'},{
//     //     update: {
//     //         method: 'PUT'
//     //     }
//     // });
//         console.log('GETTING NOISE')
//             // return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/');
//             // return $resource('http://localhost:3000/air_data').get();
//     //   return $resource(
//     //   'http://localhost:3000/noise_data'
//     //   // { method: 'getTask', q: '*' }, // Query parameters
//     //   // {'query': { method: 'GET' }}
//     //   // {'query': {method: 'GET', isArray: false }}
//     // );


//       return $resource('http://localhost:3000/noise_data/', {method: 'GET'});




// })
// }).service('popupService',function($window){
//     this.showPopup=function(message){
//         return $window.confirm(message);
//     }
// });