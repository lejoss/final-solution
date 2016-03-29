/**
 * Created by lejoss on 16/11/15.
 */
(function(){
    'use strict';

    angular
        .module('final-solution', ['final-solution.core'])
        .config(function($stateProvider, $urlRouterProvider) {


            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state("/", {
                    url: '/',
                    templateUrl: '../views/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboardCtrl'
                });
        })
        .run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
})();