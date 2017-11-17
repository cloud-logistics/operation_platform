/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BasicinfoController', BasicinfoController);

    /** @ngInject */
    function BasicinfoController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlist = [];
        vm.queryParams = $stateParams;
        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        var transformations = undefined;

        var requiredOptions = [
                    "containerType",
                    "carrier",
                    "factory",
                    "factoryLocation"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                containerType: optionsTransFunc(vm.options.containerType),
                carrier: optionsTransFunc(vm.options.carrier),
                factory: optionsTransFunc(vm.options.factory),
                factoryLocation: optionsTransFunc(vm.options.factoryLocation),
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            }

            vm.queryParams = {
                containerType : R.compose(R.prop("value"),R.head)(vm.options.containerType),
                carrier : R.compose(R.prop("value"),R.head)(vm.options.carrier),
                factory : R.compose(R.prop("value"),R.head)(vm.options.factory),
                factoryLocation : R.compose(R.prop("value"),R.head)(vm.options.factoryLocation),
                startTime: moment(new Date()),
                endTime: moment(new Date())
            }

            getBasicInfo();
        })

        vm.getBasicInfo = getBasicInfo
        
        function getBasicInfo () {
            var data = {
                container_id:vm.queryParams.containerId ||'all',
                container_type:vm.queryParams.containerType || 0,
                factory: vm.queryParams.factory||0,
                start_time:vm.queryParams.startTime ? new Date(vm.queryParams.startTime.format("YYYY-MM-DD")).getTime() :0,
                end_time:vm.queryParams.endTime ? new Date(vm.queryParams.endTime.format("YYYY-MM-DD")).getTime() : 0,
                limit:$scope.conf.itemsPerPage,
                offset: ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage
            }
            ApiServer.getBasicInfo(data, function (response) {
                vm.containerlist = response.data.data.results;
                $scope.conf.totalItems = response.data.data.count;
                console.log(vm.containerlist);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        $scope.$watchGroup(['conf.currentPage','conf.itemsPerPage'],getBasicInfo)
    }

})();