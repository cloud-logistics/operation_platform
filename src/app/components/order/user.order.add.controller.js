/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('orderUserAddController', orderUserAddController);

    /** @ngInject */
    function orderUserAddController($scope,$state,$log,$uibModal,ApiServer,$stateParams,toastr,$filter,$timeout) {
        /* jshint validthis: true */
        var vm = this;
        
        
        var orderId = $stateParams.orderId;
        var info = ApiServer.info();

        vm.isReadOnly = true;
        vm.shouldManualBack = false;
        vm.orderInfo = {consigningform:{goodslist:[],clientid:info.id,cargoagentid:''}};
        vm.companys = [];
        vm.company = {};

        vm.submitAction = submitAction;
        vm.confirmReceived = confirmReceived;
        vm.didSelectCompanyAction = didSelectCompanyAction;
        vm.cancelAction = cancelAction;


        if (orderId === 'new'){
            vm.isReadOnly = false;
        }

        function submitAction() {

            //判断是否添加了货物
            if (vm.orderInfo.consigningform.goodslist.length == 0){
                toastr.error('请添加货物');
                return;
            }


            vm.orderInfo.consigningform.expecteddeliverydate = $filter('date')($scope.expecteddeliverydate,'yyyy-MM-dd HH:mm:ss');

            console.log(vm.orderInfo);
            ApiServer.clientOrderAdd(vm.orderInfo,function (res) {
                toastr.success('创建成功');
                // vm.shouldManualBack = true;
                $timeout(function () {
                    $state.go('app.userorder');
                },2000);
            },function (err) {
                var errInfo = '创建订单失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        function cancelAction() {
            $state.go('app.userorder');
        }
        function confirmReceived() {

            var now = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            var param = {clientId:info.id,orderId:orderId,dateforconfirmreceipt:now};
            ApiServer.clientOrderConfirmReceipt(param,function (res) {
                console.log(res);
                vm.orderInfo.state = 'order_goods_received';
                toastr.success('操作成功');
            },function (err) {
                var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        function didSelectCompanyAction(company) {
            vm.company = company;
            vm.orderInfo.consigningform.cargoagentid = vm.company.id;
        }
        function getCompanyDatas() {
            ApiServer.userGetByRoleType('cargoagent',function (res) {
                vm.companys = res.data;
                if (vm.companys){
                    vm.company = vm.companys[0];
                    vm.orderInfo.consigningform.cargoagentid = vm.company.id;
                }
                getOrderDatas();
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        function getCompanyById(cargoagentId) {
            for (var i = 0; i < vm.companys.length; i++){
                if (vm.companys[i].id === cargoagentId){
                    vm.company = vm.companys[i];
                    break;
                }
            }
        }
        function getOrderDatas() {
            if (orderId === 'new'){
                return;
            }
            ApiServer.orderGet(orderId,function (res) {
                vm.orderInfo = res.data;
                console.log(vm.orderInfo);
                getCompanyById(vm.orderInfo.consigningform.cargoagentid);
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }

        getCompanyDatas();


        
        
        
        
        
        $scope.today = function() {
            $scope.expecteddeliverydate = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.expecteddeliverydate = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];


        //Model
        vm.addGoodAction = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'orderModalContent.html',
                size: size,
                controller:'ModalOrder4ClientInstanceCtrl',
                resolve: {
                    good: function () {
                        return {name:'',type:'',measurement:'',grossweight:''};
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.orderInfo.consigningform.goodslist.push(param);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        vm.tipsInfo = {title:'警告',content:'确认已经收到货物了吗？'};
        vm.openAlert = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                confirmReceived();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };




    }

})();
