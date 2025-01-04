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
          controller: function($http, $scope, $timeout, $window) {
            loadPokemon();
            function loadPokemon() {
              delete $scope.pokemon;
              $http.get('https://pokeapi.co/api/v2/pokemon/' + Math.ceil(Math.random() * 150))
                .then(function(response) {
                  $timeout(function() {
                    $scope.pokemon = response.data;
                  }, 1000);
                });
            }
            function handleEvent(event) {
              if (event.detail === 'reload') loadPokemon();
            }
            $window.addEventListener('pokemon-event', handleEvent);
            $scope.$on('$destroy', function() {
              $window.removeEventListener('pokemon-event', handleEvent);
            });
          },
          template: '<pokemon-page angular-pokemon="{{pokemon}}"></pokemon-page>'
        }).
        otherwise('/phones');
    }
  ]);
