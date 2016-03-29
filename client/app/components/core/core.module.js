/**
 * Created by lejoss on 21/11/15.
 */
(function() {
    'use strict';

    // module for custom configurations
    
    angular
        .module('final-solution.core',['ngMaterial', 'ui.router', 'ngAnimate','chart.js'])
        .config(function ($mdThemingProvider, ChartJsProvider) {

            // App Color theme
            $mdThemingProvider.theme('default')
                .primaryPalette('indigo', {
                    'default': '500',
                    'hue-1': '100',
                    'hue-2': '600',
                    'hue-3': '800'
                })
                .accentPalette('light-blue',{
                    'default': '500',
                    'hue-1': '100',
                    'hue-2': '700',
                    'hue-3': 'A700'
                })
                .warnPalette('red')
                .backgroundPalette('grey');

            ChartJsProvider.setOptions({
                colours: ['#FF5252', '#3F51B5']
            });
        });
})();