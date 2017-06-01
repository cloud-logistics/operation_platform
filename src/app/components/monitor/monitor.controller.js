/**
 * Created by guankai on 17/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MonitorController', MonitorController);

    /** @ngInject */
    function MonitorController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;


        var info = ApiServer.info();
        var roleType = info.role;
        vm.title = '云箱监控';
        vm.containerlists = [];
        vm.realtimeParams = {};
        vm.instantlocationParams = {};
        vm.historylocationParams = {};
        vm.alertParams = {};
        vm.basicinfoParams = {};
        vm.boxstatusParams = {};
        vm.historyParams = {};


        var requiredOptions = [
                    "containerType",
                    "alertLevel",
                    "alertType",
                    "alertCode",
                    "carrier",
                    "factory",
                    "currentStatus"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options
            console.log(options);
        })

    }

})();