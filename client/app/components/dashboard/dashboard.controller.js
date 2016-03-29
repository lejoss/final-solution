/**
 * Created by lejoss on 16/11/15.
 */

(function(){
    'use strict';

    angular
        .module('final-solution')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$state', 'dashboardService', '$timeout'];

    function DashboardController ($scope, $state, dashboardService, $timeout) {

        var dashboardCtrl                  = this;
        dashboardCtrl.result_array         = null;
        dashboardCtrl.spinner              = false;

        dashboardCtrl.labels = ["car_1", "car_2", "car_3", "car_4"];
        dashboardCtrl.series = ['Claw Time', 'Regular Time'];

       /* // barChar data
        dashboardCtrl.data = [
            {name: "Test", score: 0}
        ];
        // round progress data
        dashboardCtrl.roundProgressData = {
            label: 0,
            percentage: 0.0
        };*/


        // methods
        dashboardCtrl.getClawfullByRate = getClawfullByRate;

        ////////////////////////////////////////////////////////////////

        function getClawfullByRate(rate) {
            return dashboardService.getClawfullByRatePromise(rate)
                .then(function(data) {

                    $timeout(function() {
                        dashboardCtrl.spinner = !dashboardCtrl.spinner;
                    }, 1500);

                    dashboardCtrl.result_array = [];
                    dashboardCtrl.result_array = data.data;
                    dashboardCtrl.sliderModel = 0;
                    dashboardCtrl.spinner = !dashboardCtrl.spinner;

                    return dashboardCtrl.result_array;

                    /*// helper obj to name props in result_array when reducing
                    var props = {
                        0: 'timeClaw',
                        1: 'time'
                    };
                    var result =
                        _.reduce(dashboardCtrl.result_array, function(obj, val, key) {
                            obj[props[key]] = val;
                            return obj;
                    }, {});*/
                });
        }

        // watchers ( group watchers later ) //////////////////////////////
        $scope.$watch('dashboardCtrl.sliderModel', function(newVal) {
            angular.forEach($scope.data, function(d) {
                d.score = newVal;
            },true);
        });

      /*  // Here I synchronize the value of label and percentage in order to have a nice demo
        $scope.$watch('roundProgressData', function (newValue, oldValue) {
            newValue.percentage = newValue.label / 100;
        }, true);*/
    }
})();




