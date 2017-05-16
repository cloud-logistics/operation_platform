/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('smart_container')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: false,//http://52.80.40.26:9090/
            logLevel: 111111,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            apiHost_ONLINE:'http://52.80.40.26:9090/', //http://54.223.162.108:9090/ production1
            apiHost_OFFLINE:'http://52.80.40.26:9090/',//http://54.223.29.24:9090/ production2
            token:'airspc_access_authorization',
            informationKey:'airspc_information',
            api:{
                resource:{
                    vehicle:'resource/vehicle',
                    shippingSchedule:'resource/shippingschedule',
                    container:'resource/container',
                    transportTask:'resource/transporttask'
                },
                order:'order',
                user:'user',
                message:'message'
            }
        });
})();
