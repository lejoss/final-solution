/**
 * Created by lejoss on 22/11/15.
 */
(function(){
    'use strict';

    angular
        .module('final-solution')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];

    function dashboardService($http) {

        return {
            getClawfullByRatePromise: getClawfullByRatePromise
        };

        function getClawfullByRatePromise(rate) {
            return $http.get('/api/clawfull/'  + rate);
        }
    }
})();