/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxMalfunController', BoxMalfunController);

    /** @ngInject */
    function BoxMalfunController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}


        vm.newIssueConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        vm.saveIssueInfoConfig = saveIssueInfoConfig;
        vm.cancelIssueInfoConfig = cancelIssueInfoConfig;


        getIssueInfoManage();
        var timer = $interval(function(){
            getIssueInfoManage();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });

        function getIssueInfoManage () {
            ApiServer.getIssueInfoManage(function (response) {
                vm.issueInfoManage = response.data.issueInfo
                console.log(vm.issueInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveIssueInfoConfig() {
            newIssueConfigPost();

            $scope.modalShow = false;
        }

        function cancelIssueInfoConfig() {
            $scope.modalShow = false;
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

        function newIssueConfigPost () {

            var config = R.evolve({
                alertCode: inputTransFunc
            })(vm.newIssueConfig)
            console.log("new issueInfo params: ", config);

            ApiServer.newIssueConfig(config, function (response) {
                console.log(response.data);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }


        $scope.modalUpdate = function(){
            $scope.modalShow = !$scope.modalShow;
        };

    }

})();