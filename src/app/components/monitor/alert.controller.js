/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlists = [];

        vm.alerts = [];
        vm.queryParams = $stateParams
        vm.options = {}


        var timer = $interval(function(){
            getAlerts();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        vm.getAlerts = getAlerts
        var transformations = undefined;

        var requiredOptions = [
                    "alertLevel",
                    "alertCode",
                    "alertType"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options;

            transformations = {
                alertCode: optionsTransFunc(vm.options.alertCode),
                alertType: optionsTransFunc(vm.options.alertType),
                alertLevel: optionsTransFunc(vm.options.alertLevel)
            }

            vm.queryParams = {
                alertCode : R.compose(R.prop("value"),R.head)(vm.options.alertCode),
                alertLevel : R.compose(R.prop("value"),R.head)(vm.options.alertLevel),
                alertType : R.compose(R.prop("value"),R.head)(vm.options.alertType)
            }
            getAlerts();
        })
        
        function getAlerts () {
            var queryParams = R.evolve(transformations)(vm.queryParams)
            console.log(queryParams);
            ApiServer.getAlerts(queryParams, function (response) {
                vm.alerts = response.data.alerts
                console.log(vm.alerts);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();