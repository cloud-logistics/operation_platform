
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController(logger,toastr,StorageService,$timeout,$state,constdata,$rootScope,iotUtil,$translate,ApiServer,md5) {
        /* jshint validthis: true */
        var vm = this;
        var authorizationKey = constdata.token;
        //语言
        var langChi = '中文';
        var langEng = 'English';
        var userLanguage = window.localStorage.userLanguage;

        vm.user = {username:'',password:''};
        vm.isLogining = false;


        vm.login = loginAction;
        vm.logout = logoutAction;
        vm.username = username;
        vm.gotoRegisterAction = gotoRegisterAction;
        
        function gotoRegisterAction() {
            $state.go('access.signup');
        }
        function loginAction() {

            if (!(vm.user.username && vm.user.password)){
                return;
            }

            vm.isLogining = true;
            StorageService.remove(constdata.token);
            var now = new Date;
            now = parseInt(now / 1000);

            var user = {
                    username: vm.user.username,
                    password: md5.createHash(md5.createHash(vm.user.password)+now),
                    timestamp:now
            }

            ApiServer.userLogin(user,function (response) {
                console.log('login success');
                console.log(response);
                var result = response.data;

                var sessionId = result.sessionid;
                var token = result.token;
                var role = result.role;
                var userInfo = {
                    username: user.username,
                    role: role
                }

                // var sessionInfo = {username: user.username, Authorization:token};
                var sessionInfo = {Authorization:token};

                StorageService.put(authorizationKey,sessionInfo,24 * 7 * 60 * 60);//3 天过期
                StorageService.put(constdata.informationKey,userInfo,24 * 3 * 60 * 60);

                var appGo = 'app.siteoverview';

                $rootScope.$on('$locationChangeSuccess',function(){//返回前页时，刷新前页
                    parent.location.reload();
                });

                $state.go(appGo);
            },function (err) {
                toastr.error(err.msg || "用户名密码错误.");
                vm.isLogining = false;
            });

        }
        function username() {
            var information = StorageService.get(constdata.informationKey);
            return information.username;
        }
        
        function logoutAction() {
            $timeout(function () {
                StorageService.clear(authorizationKey);
                StorageService.clear(userInfo);
                StorageService.clear(constdata.token);
            },60);
            $state.go('access.signin');
        }

        //切换语言
        userLanguage == 'zh-cn' ? vm.langChoosen = langChi : vm.langChoosen = langEng
        userLanguage == 'zh-cn' ? vm.langLeft = langEng : vm.langLeft = langChi
        vm.toggleLang = function(lang) {
            vm.langChoosen = (vm.langChoosen == langChi) ? langEng : langChi
            vm.langLeft = (vm.langLeft == langChi) ? langEng : langChi;
            lang == langEng ? $translate.use('en-us') : $translate.use('zh-cn');
            lang == langEng ? window.localStorage.userLanguage='en-us' :  window.localStorage.userLanguage='zh-cn'
        }

    }

})();



