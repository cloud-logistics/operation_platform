/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('orderCarPackingController', orderCarPackingController);

    /** @ngInject */
    function orderCarPackingController($log,toastr,$state,ApiServer,$stateParams,$uibModal,$filter,$timeout) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();
        var orderId = $stateParams.orderId;

        vm.containers = [];
        vm.isReadOnly = false;
        vm.packingInfo = {carrierid:info.id,orderid:orderId,packinglist:{items:[],dateforpackinggoods:''}};

        vm.submitAction = submitAction;


        function submitAction(type) {

            if (type === 'later'){
                $state.go('app.carorderadd',{orderId:orderId});
                return;
            }

            //判断是否添加了货物
            if (vm.packingInfo.packinglist.items.length == 0){
                toastr.error('请添加货物');
                return;
            }

            vm.packingInfo.packinglist.dateforpackinggoods = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            if (type === 'confirm'){
                console.log(vm.packingInfo);
                ApiServer.carOrderPackgoods(vm.packingInfo,function (res) {
                    toastr.success('操作成功');
                    $timeout(function () {
                        $state.go('app.carorderadd',{orderId:orderId});
                    },2000);
                },function (err) {
                    var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                })
            }else{
                history.back();
            }
        }

        function getOrder() {
            ApiServer.orderGet(orderId,function (res) {
                vm.containers = res.data.bookingform.containers;

               console.log(res.data.bookingform.containers);//ContainerNo

            },function (err) {
                var errInfo = '获取集装箱数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        getOrder();



        //Model
        vm.addGoodAction = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'orderModalContent.html',
                size: size,
                controller:'ModalOrder4ClientInstanceCtrl',
                resolve: {
                    good: function () {
                        return {name:'',type:'',measurement:'',grossweight:'',containers:vm.containers};
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.packingInfo.packinglist.items.push(param);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }

})();
