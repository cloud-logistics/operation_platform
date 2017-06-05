/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxAlertController', BoxAlertController);

    /** @ngInject */
    function BoxAlertController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}


        vm.newAlertConfig = {};
        vm.alertInfoManage = {};

        vm.saveAlertInfoConfig = saveAlertInfoConfig;
        vm.cancelAlertInfoConfig = cancelAlertInfoConfig;
        vm.newAlertConfigPost = newAlertConfigPost;

 
        getAlertInfoManage();
        var timer = $interval(function(){
            getAlertInfoManage();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function getAlertInfoManage () {
            ApiServer.getAlertInfoManage(function (response) {
                vm.alertInfoManage = response.data
                console.log(vm.alertInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveAlertInfoConfig() {
            newAlertConfigPost();

            $scope.modalInput = !$scope.modalInput;
        }

        function cancelAlertInfoConfig() {
            $scope.modalInput = !$scope.modalInput;
        }

        function newAlertConfigPost () {
            var config = vm.newAlertConfig
            console.log("new alertInfo params: ", config);

            ApiServer.newAlertConfig(config, function (response) {
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