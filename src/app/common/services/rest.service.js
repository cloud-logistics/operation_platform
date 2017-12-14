(function () {
    'use strict';

    /** RestService */
    angular
        .module('smart_container')
        .factory('RestService', RestService);

    // REST service based on Restangular  that uses setFullResponse
    /** @ngInject */
    function RestService(Restangular,StorageService,logger,constdata,$q) {
        console.log('sss==',Restangular)
        $q.resolve();
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });
    }

    /** NetworkService */
    angular
        .module('smart_container')
        .factory('NetworkService', NetworkService);

    /** @ngInject */
    function NetworkService(RestService,StorageService,$state,toastr,$q,constdata) {
        var canceler = $q.defer();

        var service = {
            post  : post,
            get   : get,
            put   : put,
            delete: del
        };

        return service;

        /////////////////

        function post(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPOST(param,"","",requestHeader()
            ).then(

                function (response) {
                    if(response.data['status'] == 'NoDataFound'){
                        toastr.noDataFound();
                    }else{

                        successResponse(response,successHandler);}
                },function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );
        }

        function get(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customGET("",param,requestHeader()).then(function (response) {
                if(response.data['status'] == 'NoDataFound'){
                    toastr.noDataFound();
                }else{
                    successResponse(response,successHandler);
                }
            },function (response) {
                failedResponse(response,failedHandler,path);
            });
        }

        function put(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPUT(param,"","",requestHeader()).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        function del(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customDELETE(param,param,requestHeader()).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                console.log('delete failed');
                failedResponse(response,failedHandler,path);
            });
        }

        function successResponse(res,successHandler) {
            var data = res.data;
            if (data){
                if (typeof data === 'string'){
                    try {
                        var rst = angular.fromJson(data);
                        successHandler({data:rst});
                    }catch (e){
                        successHandler({data:null});
                    }
                }else{
                    var rst = angular.fromJson(data);
                    successHandler({data:rst});
                }
            }else{
                successHandler({data:null});
            }
        }
        function failedResponse(response,failedHandler,path) {

            console.log('-------' + path + '---------');
            console.log(response);
            if(response && (response.status == 401 || response.status == -1)){
                if (!canceler){
                    //canceler.resolve('user cancel');
                    //canceler.reject();
                }else{
                    toastr.info('登录超时，请重新登录');
                    canceler = null;
                    $state.go('access.signin');
                }
            }else{
                var newResponse = {};
                newResponse.status = response.status;
                if (response.data && response.data.Error){
                    newResponse.statusText = response.data.Error;
                }else{
                    newResponse.statusText = '服务器出错了~';//未知错误，先显示成这样
                }
                if (response.data && response.data.msg){
                    newResponse.msg = response.data.msg;
                }else{
                    newResponse.msg = '服务器出错了~';//未知错误，先显示成这样
                }
                if (failedHandler){
                    failedHandler(newResponse);
                }
            }
        }

        function requestHeader() {
            var sessionInfo = StorageService.get(constdata.token);
            if (sessionInfo && sessionInfo !== 'undefined'){
                return sessionInfo;
            }
            return {};
        }

    }


    /** StorageService */
    angular
        .module('smart_container')
        .service('StorageService', StorageService);

    /** @ngInject */
    function StorageService() {

        this.put=function (key,value,exp) {
            if(window.localStorage){
                var curtime = new Date().getTime();//获取当前时间
                if(!exp){
                    exp = 0;
                }
                localStorage.setItem(key,JSON.stringify({val:value,time:curtime,exp:exp}));//转换成json字符串序列
            }else{
                console.log('This browser does NOT support localStorage');
            }
        };
        this.get=function (key) {
            if(window.localStorage){
                var val = localStorage.getItem(key);
                if (!val) return null;
                var dataobj = JSON.parse(val);

                if (!dataobj) return null;

                if((dataobj.exp !== 0) && (new Date().getTime() - dataobj.time > dataobj.exp * 1000)) {
                    console.log("expires");//过期
                    return null;
                }
                else{
                    //console.log("val="+dataobj.val);
                    return dataobj.val;
                }

            }else{
                console.log('This browser does NOT support localStorage');
                return null;
            }
        };

        this.clear = function (key) {
            localStorage.removeItem(key);
        };

        this.remove = function (key) {
            localStorage.removeItem(key);
        };

        this.item = function (key,value) {
            if (value){
                this.put(key,value,60 * 60);
            }
            var val = this.getItem(key);
            return val;
        };
        this.getItem = function (key) {
            var val = this.get(key);
            return val;
        };

    }

})();
