/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainersController', ContainersController);

    /** @ngInject */
    function ContainersController($state,$log,$uibModal,ApiServer,toastr) {
        /* jshint validthis: true */
        var vm = this;
        
        var info = ApiServer.info();

        vm.titles = ['集装箱编号','类型','最大重量','毛重','尺寸','操作'];

        vm.items = [];

        vm.displayedCollection = [].concat(vm.items);



        vm.gotoDetail = gotoDetail;

        function gotoDetail(type,index) {
            if (type === 'new'){
                $state.go('app.container',{containerId:'new'});
            } else if (type === 'detail'){
                $state.go('app.container',{containerId:vm.items[index].id});
            }
        }
        function deleteAction(index) {
            ApiServer.vehicleDelete(vm.items[index].id,function (res) {
                toastr.success('删除成功');
            },function (err) {
                var errInfo = '删除失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        function getDatas() {
            ApiServer.containerGetByOwner(info.id,function (res) {
                vm.items = res.data;
                console.log(res);
            },function (err) {
                var errInfo = '获取信息失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        getDatas();


        //Model
        vm.tipsInfo = {title:'删除',content:'确定删除吗？'};
        vm.openAlert = function (size,index) {
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
                deleteAction(index);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };




    }

})();
