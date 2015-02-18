'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

    controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'md5', 'User', '$cookieStore', function ($scope, $rootScope, $location, md5, User, $cookieStore) {
        $rootScope.shownav = false;
        $rootScope.loggedGroup = null;
        $rootScope.loggedUser = null;
        $rootScope.formid = null;
        $rootScope.token = null;
        $rootScope.auth_ret = null;
        $scope.res = "Please Login";

        if($cookieStore.get("saCookie") != null)
        {
            var cookie = $cookieStore.get("saCookie");
            $rootScope.token = cookie.token;
            $rootScope.loggedTDA = cookie.tda;
            $rootScope.loggedGroup = cookie.group;
            $rootScope.loggedUser = cookie.user;
            //verify token with server, erase if expired.
            $location.path("/select");
        }
        $scope.login = function () {

            var mdpass = md5.createHash($scope.password);
            var user = new Object();
            user.user = $scope.username;
            user.pass = mdpass;
            User.get(user, function (data) {


                if (data.result != "FAIL") {
                    $rootScope.loggedUser = $scope.username;
                    $rootScope.loggedGroup = data.group;
                    $rootScope.loggedTDA = data.tda;
                    $rootScope.token = data.token;//STORE THIS INFO IN A COOKIE

                    var cookie = new Object();
                    cookie.token = $rootScope.token;
                    cookie.user = $rootScope.loggedUser;
                    cookie.group = $rootScope.loggedGroup;
                    cookie.tda = $rootScope.loggedTDA;


                    $cookieStore.put("saCookie", cookie);

                    //$scope.res = data;
                    $location.path("/select");
                }
                else {

                    $scope.res = "Please Try Again";
                }
            });



        };


    }]).

    controller('MainCtrl', ['$scope', '$rootScope', '$cookieStore', '$location', function ($scope, $rootScope, $cookieStore, $location) {



$rootScope.logOut = function(){
    $cookieStore.remove("saCookie");
    $location.path("/login");
};
$rootScope.unAuth = function(){//DOES NOT remove cookie- needs fix (requires manual logout)
    console.log($rootScope.ret_auth);
    if($rootScope.auth_ret == "UNAUTHORIZED"){
        $cookieStore.remove("saCookie");
        $location.path("/login");
    }
    
};
        $rootScope.shownav = $scope.shownav;
//migrate to db
        $rootScope.tdas = [
            {name: "GNY", value: 0},
            {name: "TRISTATE EAST", value: 1},
            {name: "TRISTATE WEST", value: 2},
            {name: "DENVER", value: 3},
            {name: "CHICAGO", value: 4},
            {name: "KANSAS CITY", value: 5},
            {name: "PORTLAND", value: 6},
            {name: "CONNECTICUT", value: 7},
            {name: "UPSTATE NY", value: 8}
        ];
        $rootScope.groups = [
            {},
            {name: "EVENT", value: 1},
            {name: "ACCOUNT", value: 2},
            {name: "ADMIN", value: 3}

        ];
        $rootScope.states = [
            {name: "State"},
            {name: "AL"},
            {name: "AK"},
            {name: "AZ"},
            {name: "AR"},
            {name: "CA"},
            {name: "CO"},
            {name: "CT"},
            {name: "DE"},
            {name: "DC"},
            {name: "FL"},
            {name: "GA"},
            {name: "HI"},
            {name: "ID"},
            {name: "IL"},
            {name: "IN"},
            {name: "IA"},
            {name: "KS"},
            {name: "KY"},
            {name: "LA"},
            {name: "ME"},
            {name: "MD"},
            {name: "MA"},
            {name: "MI"},
            {name: "MN"},
            {name: "MS"},
            {name: "MO"},
            {name: "MT"},
            {name: "NE"},
            {name: "NV"},
            {name: "NH"},
            {name: "NJ"},
            {name: "NM"},
            {name: "NY"},
            {name: "NC"},
            {name: "ND"},
            {name: "OH"},
            {name: "OK"},
            {name: "OR"},
            {name: "PA"},
            {name: "PR"},
            {name: "RI"},
            {name: "SC"},
            {name: "SD"},
            {name: "TN"},
            {name: "TX"},
            {name: "UT"},
            {name: "VT"},
            {name: "VA"},
            {name: "WA"},
            {name: "WV"},
            {name: "WI"},
            {name: "WY"}
        ];

    }]).

    controller('RegCtrl', ['$scope', '$rootScope', '$location', 'md5', 'User', function ($scope, $rootScope, $location, md5, User) {
        if ($rootScope.loggedGroup != 3)
            $location.path("/login");

        $scope.register = function () {

            var mdpass = md5.createHash($scope.password);
            var user = new Object();
            user.user = $scope.username;
            user.pass = mdpass;
            user.group = $scope.group.value;
            user.tda = $scope.tda.value;
            user.token = $rootScope.token;

            User.create(user, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                if (data.result == "true")
                    $scope.res = "User Created";
                else
                    $scope.res = "ERROR - User Exists";

                $scope.username = null;
                $scope.password = null;
                $scope.tda = null;
                $scope.group = null;


            });


        };


    }]).

    controller('HomeCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                $location.path("/select");

                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                $location.path("/select");
                break;
            case "1":
                $rootScope.shownav = false;
                $rootScope.admin = false;
                $location.path("/select");
                break;
            default :
                $location.path("/login");
                break;


        }
    }]).

    controller('FormCtrl', ['$scope', '$location', '$rootScope', 'Form', function ($scope, $location, $rootScope, Form) {
        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                $scope.req = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                $scope.req = false;
                break;
            case "1":
                $location.path("/login");
                break;
            default :
                $location.path("/login");
                break;


        }
        $scope.saveForm = function () {
            //generate json of the form then save it to db


            var data = new Object();
            var event;
            event = $scope.event;
            if ($rootScope.loggedGroup == 2) {
                event.tda = $rootScope.loggedTDA;

            }
            else {
                event.tda = $scope.event.tda.value;
            }

            data.address = $scope.address;
            data.city = $scope.city;
            data.state = $scope.state;
            data.phone = $scope.phone;
            data.age = $scope.age;
            data.pt = $scope.pt;
            data.m1 = $scope.m1;
            data.m2 = $scope.m2;
            data.m3 = $scope.m3;
            data.msg = $scope.msg;
            data.token = $rootScope.token;
            var test = angular.toJson(data);
            var t2 = angular.toJson(event);
            Form.create({form: test, event: t2, owner: 1}, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                $scope.event = null;
                $scope.debug = data;
                if (data.result == "Form Created") {
                    $location.path("/select");
                }

            });
        };


    }]).

    controller('ThanksCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                break;
            case "1":
                break;
            default :
                $location.path("/login");
                break;


        }
        $scope.back = function () {
            $location.path("/viewform");


        };


    }]).

    controller('UploadCtrl', ['$scope', '$rootScope', '$location', 'File', function ($scope, $rootScope, $location, File) {

        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                break;
            case "1":
                break;
            default :
                $location.path("/login");
                break;


        }
        $scope.generateFile = function(){
            data.token = $rootScope.token;
            data.form_id = $rootScope.formid;
            File.download(data, function(ret){
                $scope.download_link = ret;

            })

        };
        $scope.uploadedFile = null;
        $scope.back = function () {
            $location.path("/viewform");


        };
$scope.uploadFile = function(upFile)
{

    if ($scope.uploadedFile != null) {
        var data = new Object();
        data.file = upFile;
        data.token = $rootScope.token;
        data.form_id = $rootScope.formid;
        File.upload(data, function (ret) {
            $rootScope.auth_ret = ret.result;
            $rootScope.unAuth();
            console.log(ret);
        });
    }
    else
    {
     console.log("NULL");
    }
};
        //process file upload and send to PHP script


    }]).

    controller('FormGCtrl', ['$scope', '$rootScope', '$location', 'Form', function ($scope, $rootScope, $location, Form) {

        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                $rootScope.admin = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                break;
            case "1":
                break;
            default :
                $location.path("/login");
                break;


        }
        $scope.form_view = true;
        //var event_id;


        $scope.getForm = function () {
            if ($rootScope.formid == null)
                $rootScope.formid = $scope.formid;

            var form = Form.get({form_id: $rootScope.formid, token: $rootScope.token}, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                $scope.default = [
                    {name: "Model Preference 1", value: 0},
                    {name: "Model Preference 2", value: 0},
                    {name: "Model Preference 3", value: 0}
                ];
                $scope.models = [
                    {name: "Select Model Preference", value: "0"},
                    {name: "4Runner", value: "4Runner"},
                    {name: "Avalon", value: "Avalon"},
                    {name: "Camry", value: "Camry"},
                    {name: "Corolla", value: "Corolla"},
                    {name: "FJ Cruiser", value: "FJ Cruiser"},
                    {name: "Highlander", value: "Highlander"},
                    {name: "Land Cruiser", value: "Land Cruiser"},
                    {name: "Matrix", value: "Matrix"},
                    {name: "Prius", value: "Prius"},
                    {name: "RAV4", value: "RAV4"},
                    {name: "Sequoia", value: "Sequoia"},
                    {name: "Sienna", value: "Sienna"},
                    {name: "Tacoma", value: "Tacoma"},
                    {name: "Tundra", value: "Tundra"},
                    {name: "Venza", value: "Venza"},
                    {name: "Yaris", value: "Yaris"}
                ];

                $scope.ptime = [
                    {time: "Purchase Timeframe", value: "0"},
                    {time: "Within 1 month", value: "0-1"},
                    {time: "Within 2-3 months", value: "2-3"},
                    {time: "Within 4-6 months", value: "4-6"},
                    {time: "Within 7-12 months", value: "7-12"},
                    {time: "Within 12+ months", value: "12+"}
                ];

                $scope.ages = [
                    {name: "Age", value: "0"},
                    {name: "\< 18", value: "<18"},
                    {name: "18-35", value: "18-35"},
                    {name: "36-45", value: "36-45"},
                    {name: "46-55", value: "46-55"},
                    {name: "56-65", value: "56-65"},
                    {name: "65+", value: "65+"}

                ];
                //automate mapping from json?

                $scope.address = data["template"].address;
                $scope.city = data["template"].city;
                $scope.state = data["template"].state;
                $scope.phone = data["template"].phone;
                $scope.age = data["template"].age;
                $scope.pt = data["template"].pt;
                $scope.m1 = data["template"].m1;
                $scope.m2 = data["template"].m2;
                $scope.m3 = data["template"].m3;
                $scope.msg = data["template"].msg;
                $scope.debug = angular.toJson(data);
                $scope.show = true;

                //defaults
                $scope.eid = data["event_id"];
                $scope.interest = $scope.models[0];
                $scope.interest2 = $scope.models[0];
                $scope.interest3 = $scope.models[0];
                $scope.p_time = $scope.ptime[0];
                $scope.age1 = $scope.ages[0];
                $scope.state1 = $scope.states[0];

                $scope.contact1 = true;
                $scope.contact2 = true;


            });


        };
        if ($rootScope.formid != null)
            $scope.getForm();

        $scope.submitForm = function () {
            var frm;
            frm.token = $rootScope.token;
            frm = $scope.form;
            frm.state = $scope.state1.name;
            frm.age = $scope.age1.value;
            frm.interest = $scope.interest.value;
            frm.interest2 = $scope.interest2.value;
            frm.interest3 = $scope.interest3.value;
            frm.p_time = $scope.p_time.value;
            frm.event = $scope.eid;
            frm.toyota_contact = $scope.contact1;
            frm.do_not_contact = $scope.contact2;


            Form.submit(frm, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                $scope.debug = data;
                if (data)
                    $location.path("/thanks");

            })


        }
    }]).

    controller('SelectCtrl', ['$scope', '$rootScope', '$location', 'Form', '$cookieStore', function ($scope, $rootScope, $location, Form, $cookieStore) {

        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                break;
            case "1":
                $rootScope.shownav = false;
                $rootScope.admin = false;
                break;
            default :
                $location.path("/login");
                break;


        }

        $scope.upload = function (id) {
            console.log("UPLOAD CLICKED");
            $rootScope.formid = id;
            $location.path("/upload");

        };

        var getEvents = function () {
            var usr = new Object();
            usr.tda = $rootScope.loggedTDA;
            usr.admin = $rootScope.admin;
            usr.archive = "0";
            usr.token = $rootScope.token;
            Form.list(usr, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                $scope.forms = data;
            });

        };

        var getArch = function () {
            var usr = new Object();
            usr.tda = $rootScope.loggedTDA;
            usr.admin = $rootScope.admin;
            usr.archive = "1";
            usr.token = $rootScope.token;
            Form.list(usr, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                $scope.aforms = data;
            });

        };

        getEvents();
        getArch();

        $scope.archive = function (id) {
            var ids = new Object();
            ids.form_id = id;
            ids.token = $rootScope.token;
            Form.archive(ids, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                getEvents();
                getArch();
            });


        };
        $scope.delete = function (id) {
            var ids = new Object();
            ids.form_id = id;
            ids.token = $rootScope.token;
            Form.delete(ids, function (data) {
                $rootScope.auth_ret = data.result;
                $rootScope.unAuth();
                getEvents();
                getArch();
            });


        };
        $scope.click = function (id, id2) {
            $rootScope.formid = id;
            $location.path("/viewform");


        };
        $scope.new = function () {

            $location.path("/formcreator");
        };
        $scope.user = $rootScope.loggedUser;

    }]).

    controller('UsersCtrl', ['$scope', '$rootScope', '$location', 'User', 'md5', function ($scope, $rootScope, $location, User, md5) {
        var tk = new Object();
        tk.token = $rootScope.token;
        switch ($rootScope.loggedGroup) {
            case "3":
                $rootScope.shownav = true;
                $rootScope.admin = true;
                break;
            case "2":
                $rootScope.shownav = true;
                $rootScope.admin = false;
                break;
            case "1":
                $location.path("/select");
                $rootScope.shownav = false;
                $rootScope.admin = false;
                break;
            default :
                $location.path("/login");
                break;


        }
        var usr = new Object();
        usr.tda = $rootScope.loggedTDA;
        var form = new Object();
        usr.admin = $rootScope.admin;


        User.list(tk, function (data) {
            $rootScope.auth_ret = data.result;
            $rootScope.unAuth();

            $scope.forms = data;
        });

        $scope.change = function (id, pass) {


            var usr = new Object();
            usr.id = id;
            usr.pass = md5.createHash(pass);
            usr.token = $rootScope.token;
            User.change(usr, function (ret) {
                $rootScope.auth_ret = ret.result;
                $rootScope.unAuth();
                User.list(tk, function (data) {
                    $scope.forms = data;
                });

            });


        };
        $scope.delete = function (uid) {
            var user = new Object();
            user.uid = uid;
            user.token = $rootScope.token;
            User.delete(user, function (ret) {
                $rootScope.auth_ret = ret.result;
                $rootScope.unAuth();
                User.list(tk, function (data) {
                    $scope.forms = data;
                });

            })


        };
        $scope.new = function () {

            $location.path("/register");
        };
        $scope.user = $rootScope.loggedUser;

    }]);
