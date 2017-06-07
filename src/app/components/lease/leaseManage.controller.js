/**
 * Created by guankai on 07/06/2017.
 */
/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('LeaseManageController', LeaseManageController);

    /** @ngInject */
    function LeaseManageController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '租赁管理方';
        vm.reports = [];
        vm.queryParams = {};
        vm.newCarrier = {};
        vm.carriers = {};

        $scope.lmUpdate = function () {

            $scope.leaseShow = !$scope.leaseShow;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };

        vm.saveNewCarrier = saveNewCarrier
        vm.cancelNewCarrier = cancelNewCarrier

        vm.options = {};
        var transformations = undefined;

        var requiredOptions = [
                    "leaseType"
                ];

        ApiServer.getOptions(requiredOptions, function(options) {
            vm.options = options

            transformations = {
                leaseType: optionsTransFunc(vm.options.leaseType),
                contractEndTime: R.compose(R.toString, Date.parse),
            };

            vm.newCarrier = {
                leaseType : R.compose(R.prop("value"),R.head)(vm.options.leaseType),
                contractEndTime: moment(new Date())
            };

            console.log(options);
        })

        getCarriers();

        function getCarriers () {
            ApiServer.getCarriers(function (response) {
                // console.log(Date.parse(vm.queryParams.startTime).toString());
                vm.carriers = response.data.carriers
                console.log(vm.carriers);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function saveNewCarrier() {
            console.log("save");
            newCarrierPost();
        }

        function cancelNewCarrier() {
        }

        function newCarrierPost () {
            var config = R.evolve(transformations)(vm.newCarrier)
            console.log("new basicInfo params: ", config);
            ApiServer.newCarrier(config, function (response) {
                console.log(response.data.code);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

    }

})();