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


        var requiredOptions = [
                    "containerType",
                    "reportType"
                ]

        getContainerReportHistory()

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
                reportType : R.compose(R.prop("value"),R.head)(vm.options.reportType),
                startTime: moment(new Date()),
                endTime: moment(new Date())
            }
        })

        vm.getContainerReportHistory = getContainerReportHistory

        function getContainerReportHistory () {
            var queryParams = R.evolve(transformations)(vm.queryParams)

            ApiServer.getContainerReportHistory(queryParams, function (response) {
                console.log(queryParams);
                vm.reports = R.merge(response.data.result)({
                    reportLength: R.length(response.data.result.record)
                })
                console.log(vm.reports);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();