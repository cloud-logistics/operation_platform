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

        $scope.lmUpdate = function () {

            $scope.leaseShow = !$scope.leaseShow;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };


    }

})();