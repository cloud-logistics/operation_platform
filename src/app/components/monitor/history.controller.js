/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistoryController', HistoryController);

    /** @ngInject */
    function HistoryController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}

        var transformations = undefined;

        getContainerReportHistory();
        var timer = $interval(function(){
            getContainerReportHistory();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        var requiredOptions = [
                    "containerType",
                    "reportType"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                containerType: optionsTransFunc(vm.options.containerType),
                reportType: optionsTransFunc(vm.options.reportType),
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            }

            vm.queryParams = {
                containerType : R.compose(R.prop("value"),R.head)(vm.options.containerType),
                reportType : R.compose(R.prop("value"),R.head)(vm.options.reportType)
            }
        })

        vm.getContainerReportHistory = getContainerReportHistory
        
        function getContainerReportHistory () {
            var queryParams = R.evolve(transformations)(vm.queryParams)

            ApiServer.getContainerReportHistory(queryParams, function (response) {
                console.log(queryParams);
                vm.reports = response.data.containerReportHistory
                console.log(vm.reports);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();