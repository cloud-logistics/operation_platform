/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxRepairController', BoxRepairController);

    /** @ngInject */
    function BoxRepairController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}


        vm.newRepairConfig = {
            locationName: "中国-上海"
        };
        vm.repairInfoManage = {};

        vm.saveRepairInfoConfig = saveRepairInfoConfig;
        vm.cancelRepairInfoConfig = cancelRepairInfoConfig;
        vm.newRepairConfigPost = newRepairConfigPost;
        vm.repairUpdate = repairUpdate
        $scope.showAdd = false;
        $scope.switchShowAdd = function(){
            $scope.showAdd = ! $scope.showAdd;
        };

        getRepairInfoManage();
        var timer = $interval(function(){
            getRepairInfoManage();
        },constdata.refreshInterval, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function getRepairInfoManage () {
            ApiServer.getRepairInfoManage(function (response) {
                vm.repairInfoManage = response.data.repairInfo
                console.log(vm.repairInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveRepairInfoConfig(isUseForAdd) {
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.modalInput = !$scope.modalInput;
            }
            newRepairConfigPost();
        }

        function cancelRepairInfoConfig(isUseForAdd) {
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.modalInput = false;
            }
        }

        function repairUpdate (id) {
            console.log("hehe");
            $scope.modalInput = true;
            vm.newRepairConfig.id = id;
        }

        function newRepairConfigPost () {
            var config = vm.newRepairConfig
            console.log("new repairInfo params: ", config);

            ApiServer.newRepairConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

    }

})();
