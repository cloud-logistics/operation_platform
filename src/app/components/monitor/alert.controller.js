/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.containerlists = [];

        vm.alerts = [];
        vm.queryParams = $stateParams
        vm.options = {}

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };
        $scope.validationCheck = function(){
            $scope.isContainerIdInvalida = vm.queryParams.containerId != "" &&!constdata['validation']['id'].test(vm.queryParams.containerId);
        };
        vm.getAlerts = getAlerts

        vm.reset = reset
        vm.poweroff = poweroff
        vm.cancelcmd = cancelcmd

        var transformations = undefined;

        var requiredOptions = [
                    "alertLevel",
                    "alertCode",
                    "alertType"
                ]

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options;

            vm.options.alertCode = R.map(function(alertCode){
                return {
                    id: alertCode.id,
                    value: alertCode.value.toString()
                }
            })(vm.options.alertCode)
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
            if($scope.isContainerIdInvalida){
                return;
            }
            var queryParams = R.evolve(transformations)(vm.queryParams)
            var data = {
                container_id:queryParams.containerId || "all",
                alert_type_id:queryParams.alertType,
                limit:$scope.conf.itemsPerPage,
                offset:($scope.conf.itemsPerPage * ($scope.conf.currentPage - 1))
            };
            ApiServer.getAlerts({
                data: data,
                success: function (response) {
                    vm.alerts = response.data.data.results;
                    console.log(vm.alerts);
                    $scope.conf.totalItems = response.data.data.count;
                },
                error: function (err) {
                    toastr.error(err.msg || "获取报警监控信息失败");
                }
            });
        }


        function reset() {
            vm.commandParams = R.merge(vm.commandParams, {
                action: "reset"
            })

            deliverCmd()

            cancelcmd()
        }


        function cancelcmd () {
            $scope.resetShow = false;
            $scope.shutShow = false;
        }

        function poweroff() {
            vm.commandParams = R.merge(vm.commandParams, {
                action: "poweroff"
            })

            deliverCmd()

            cancelcmd()
        }

        function deliverCmd() {
            ApiServer.command(vm.commandParams, function(response){
                console.log(response.data);
            },function (err) {
                console.log("Get Historyview Info Failed", err);
            })
        }


        $scope.resetShow = false;
        $scope.resetClick = function () {
            $scope.resetShow = !$scope.resetShow;
        }

        $scope.shutShow = false;
        $scope.shutClick = function () {
            $scope.shutShow = !$scope.shutShow;
        }

        $scope.$watchGroup(['conf.currentPage','conf.itemsPerPage'],getAlerts)
    }

})();
