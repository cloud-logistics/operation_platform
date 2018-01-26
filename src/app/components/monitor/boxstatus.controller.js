/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxstatusController', BoxstatusController);

    /** @ngInject */
    function BoxstatusController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '云箱状态汇总';
        vm.containerlist = [];
        vm.queryParams = $stateParams
        vm.getBoxStatus = getBoxStatus
        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };
        $scope.validationCheck = function(){
            $scope.isContainerIdInvalida = vm.queryParams.containerId != "" &&!constdata['validation']['id'].test(vm.queryParams.containerId);
        };
        var transformations = undefined;

        var requiredOptions = [
            "containerType",
            "location",
            "alertLevel",
            "alertType",
            "alertCode",
            "carrier"
        ]

        vm.table = [
            {"name": "云箱ID", width: "15%"},
            {"name": "当前状态", width: "12%"},
            {"name": "所在地", width: "12%"},
            {"name": "速度(km/h)", width: "12%"},
            {"name": "温度(℃)", width: "12%"},
            {"name": "湿度(%)", width: "12%"},
            {"name": "操作", width: "25%"}
        ];

        ApiServer.getOptions(requiredOptions, function (options) {
            vm.options = options

            vm.options.alertCode = R.map(function (alertCode) {
                return {
                    id: alertCode.id,
                    value: alertCode.value.toString()
                }
            })(vm.options.alertCode)

            transformations = {
                containerType: optionsTransFunc(vm.options.containerType),
                location: optionsTransFunc(vm.options.location),
                alertLevel: optionsTransFunc(vm.options.alertLevel),
                alertType: optionsTransFunc(vm.options.alertType),
                alertCode: optionsTransFunc(vm.options.alertCode, 10),
                carrier: optionsTransFunc(vm.options.carrier)
            }

            vm.queryParams = {
                containerType: R.compose(R.prop("id"), R.head)(vm.options.containerType),
                location: R.compose(R.prop("id"), R.head)(vm.options.location),
                alertLevel: R.compose(R.prop("id"), R.head)(vm.options.alertLevel),
                alertType: R.compose(R.prop("id"), R.head)(vm.options.alertType),
                alertCode: R.compose(R.prop("id"), R.head)(vm.options.alertCode)
            }

            getBoxStatus();
        });

        function getBoxStatus() {
            //var queryParams = R.evolve(transformations)(vm.queryParams)
            if($scope.isContainerIdInvalida){
                return;
            }
            vm.gettingData = true;
            var data = {
                container_id:vm.queryParams.containerId||'all',
                container_type:vm.queryParams.containerType||0,
                location_id:vm.queryParams.location||0,
                limit:$scope.conf.itemsPerPage,
                offset:($scope.conf.itemsPerPage * ($scope.conf.currentPage - 1))
            }
            ApiServer.getBoxStatus({
                data: data,
                success: function (response) {
                    vm.containerlist = response.data.data.results;
                    $scope.conf.totalItems = response.data.data.count;
                    vm.gettingData = false;
                },
                error: function (err) {
                    toastr.error(err.msg||"获取状态汇总信息失败。");
                    vm.gettingData = false;
                }
            });
        }

        $scope.$watchGroup(['conf.currentPage', 'conf.itemsPerPage'], getBoxStatus);


        $scope.remoteUrlRequestFn = function(str) {
            return {deviceid: str};
        };
        $scope.remoteUrlResponse = function(data){
            return {
                items:_.map(data.data,function(value,key){
                    return {
                        id:key,
                        name:value,
                        full_name:value
                    }
                })
            }
        }
        $scope.selectedProject = function(data){
            if(data && data.title){
                vm.queryParams.containerId = data.title;
            }
        }
        $scope.inputChanged = function(newVal){
            vm.queryParams.containerId = newVal;
        }

    }
})();
