'use strict';

angular.
  module('phonecatApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/phones', {
          template: '<phone-list></phone-list>'
        }).
        when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        when('/pokemon', {
          controller: function($http, $scope, $timeout) {
            loadPokemon();
            function loadPokemon() {
              $http.get('https://pokeapi.co/api/v2/pokemon/' + Math.ceil(Math.random() * 150))
                .then(function(response) {
                  $timeout(function() {
                    $scope.pokemon = response.data;
                  }, 1000);
                });
            }
          },
          template: '<pokemon-page angular-pokemon="{{pokemon}}"></pokemon-page>'
        }).
        otherwise('/phones');
    }
  ]);
