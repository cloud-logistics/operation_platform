/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlists = [];

        vm.alerts = [];
        vm.queryParams = $stateParams
        vm.options = {}

        getAlerts();

        vm.getAlerts = getAlerts

        var requiredOptions = [
                    "alertLevel",
                    "alertCode",
                    "alertType"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options
        })
        
        function getAlerts () {
            console.log(vm.queryParams);
            ApiServer.getAlerts(vm.queryParams, function (response) {
                vm.alerts = response.data.alerts
                console.log(vm.alerts);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();