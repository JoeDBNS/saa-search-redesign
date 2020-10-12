// IE11 / Polyfill Array.from fix - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
if(!Array.from){Array.from=function(){var toStr=Object.prototype.toString;var isCallable=function(fn){return typeof fn==="function"||toStr.call(fn)==="[object Function]"};var toInteger=function(value){var number=Number(value);if(isNaN(number)){return 0}if(number===0||!isFinite(number)){return number}return(number>0?1:-1)*Math.floor(Math.abs(number))};var maxSafeInteger=Math.pow(2,53)-1;var toLength=function(value){var len=toInteger(value);return Math.min(Math.max(len,0),maxSafeInteger)};return function from(arrayLike){var C=this;var items=Object(arrayLike);if(arrayLike==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")} var mapFn=arguments.length>1?arguments[1]:void undefined;var T;if(typeof mapFn!=="undefined"){if(!isCallable(mapFn)){throw new TypeError("Array.from: when provided, the second argument must be a function")} if(arguments.length>2){T=arguments[2]}} var len=toLength(items.length);var A=isCallable(C)?Object(new C(len)):new Array(len);var k=0;var kValue;while(k<len){kValue=items[k];if(mapFn){A[k]=typeof T==="undefined"?mapFn(kValue,k):mapFn.call(T,kValue,k)}else{A[k]=kValue}k+=1} A.length=len;return A}}()}

// IE11 / Polyfill URLSearchParams() fix - https://github.com/jerrybendy/url-search-params-polyfill/blob/master/index.js
(function(self){'use strict';var nativeURLSearchParams=(self.URLSearchParams&&self.URLSearchParams.prototype.get)?self.URLSearchParams:null,isSupportObjectConstructor=nativeURLSearchParams&&(new nativeURLSearchParams({a:1})).toString()==='a=1',decodesPlusesCorrectly=nativeURLSearchParams&&(new nativeURLSearchParams('s=%2B').get('s')==='+'),__URLSearchParams__="__URLSearchParams__",encodesAmpersandsCorrectly=nativeURLSearchParams?(function(){var ampersandTest=new nativeURLSearchParams();ampersandTest.append('s',' &');return ampersandTest.toString()==='s=+%26';})():true,prototype=URLSearchParamsPolyfill.prototype,iterable=!!(self.Symbol&&self.Symbol.iterator);if(nativeURLSearchParams&&isSupportObjectConstructor&&decodesPlusesCorrectly&&encodesAmpersandsCorrectly){return;} function URLSearchParamsPolyfill(search){search=search||"";if(search instanceof URLSearchParams||search instanceof URLSearchParamsPolyfill){search=search.toString();} this[__URLSearchParams__]=parseToDict(search);} prototype.append=function(name,value){appendTo(this[__URLSearchParams__],name,value);};prototype['delete']=function(name){delete this[__URLSearchParams__][name];};prototype.get=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name][0]:null;};prototype.getAll=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name].slice(0):[];};prototype.has=function(name){return name in this[__URLSearchParams__];};prototype.set=function set(name,value){this[__URLSearchParams__][name]=[''+value];};prototype.toString=function(){var dict=this[__URLSearchParams__],query=[],i,key,name,value;for(key in dict){name=encode(key);for(i=0,value=dict[key];i<value.length;i++){query.push(name+'='+encode(value[i]));}} return query.join('&');};var forSureUsePolyfill=!decodesPlusesCorrectly;var useProxy=(!forSureUsePolyfill&&nativeURLSearchParams&&!isSupportObjectConstructor&&self.Proxy);Object.defineProperty(self,'URLSearchParams',{value:(useProxy?new Proxy(nativeURLSearchParams,{construct:function(target,args){return new target((new URLSearchParamsPolyfill(args[0]).toString()));}}):URLSearchParamsPolyfill)});var USPProto=self.URLSearchParams.prototype;USPProto.polyfill=true;USPProto.forEach=USPProto.forEach||function(callback,thisArg){var dict=parseToDict(this.toString());Object.getOwnPropertyNames(dict).forEach(function(name){dict[name].forEach(function(value){callback.call(thisArg,value,name,this);},this);},this);};USPProto.sort=USPProto.sort||function(){var dict=parseToDict(this.toString()),keys=[],k,i,j;for(k in dict){keys.push(k);} keys.sort();for(i=0;i<keys.length;i++){this['delete'](keys[i]);} for(i=0;i<keys.length;i++){var key=keys[i],values=dict[key];for(j=0;j<values.length;j++){this.append(key,values[j]);}}};USPProto.keys=USPProto.keys||function(){var items=[];this.forEach(function(item,name){items.push(name);});return makeIterator(items);};USPProto.values=USPProto.values||function(){var items=[];this.forEach(function(item){items.push(item);});return makeIterator(items);};USPProto.entries=USPProto.entries||function(){var items=[];this.forEach(function(item,name){items.push([name,item]);});return makeIterator(items);};if(iterable){USPProto[self.Symbol.iterator]=USPProto[self.Symbol.iterator]||USPProto.entries;} function encode(str){var replace={'!':'%21',"'":'%27','(':'%28',')':'%29','~':'%7E','%20':'+','%00':'x00'};return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g,function(match){return replace[match];});} function decode(str){return str.replace(/[ +]/g,'%20').replace(/(%[a-f0-9]{2})+/ig,function(match){return decodeURIComponent(match);});} function makeIterator(arr){var iterator={next:function(){var value=arr.shift();return{done:value===undefined,value:value};}};if(iterable){iterator[self.Symbol.iterator]=function(){return iterator;};} return iterator;} function parseToDict(search){var dict={};if(typeof search==="object"){if(isArray(search)){for(var i=0;i<search.length;i++){var item=search[i];if(isArray(item)&&item.length===2){appendTo(dict,item[0],item[1]);}else{throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");}}}else{for(var key in search){if(search.hasOwnProperty(key)){appendTo(dict,key,search[key]);}}}}else{if(search.indexOf("?")===0){search=search.slice(1);} var pairs=search.split("&");for(var j=0;j<pairs.length;j++){var value=pairs[j],index=value.indexOf('=');if(-1<index){appendTo(dict,decode(value.slice(0,index)),decode(value.slice(index+1)));}else{if(value){appendTo(dict,decode(value),'');}}}} return dict;} function appendTo(dict,name,value){var val=typeof value==='string'?value:(value!==null&&value!==undefined&&typeof value.toString==='function'?value.toString():JSON.stringify(value));if(name in dict){dict[name].push(val);}else{dict[name]=[val];}} function isArray(val){return!!val&&'[object Array]'===Object.prototype.toString.call(val);}})(typeof global!=='undefined'?global:(typeof window!=='undefined'?window:this));


// OnLoad Run
window.addEventListener('load', function() {
    CheckForIE();

    InitNavigationMenu();
    InitMainPopup();

    GetUrlParams();

    if (typeof MainVue.urlParams.programSearch !== 'undefined') {
        MainVue.search = MainVue.urlParams.programSearch;
        MainVue.GetMiTalentProgramsUnique();
    }
});


function CheckForIE() {
    if (window.document.documentMode) {
        alert('IE Browser Is Not Supported!');
    }
}


window.onbeforeunload = function () {
    window.history.replaceState(null, null, '?programSearch=' + encodeURI(MainVue.search.trim().replace(/\./g, '').replace(/\'/g, '')));
};

function GetUrlParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    var entriesDict = {};
    var entriesArray = Array.from(entries);
    entriesArray.forEach(function (entry) {
        entriesDict[entry[0]] = entry[1];
    });
    MainVue.urlParams = entriesDict;
}


function InitNavigationMenu() {
    let nav_toggler = document.querySelector('.navbar-toggler');
    let nav_popup = document.querySelector('.navbar-popup');

    nav_toggler.addEventListener('click', function() {
        if (nav_popup.classList.contains('navbar-popup-show')) {
            nav_toggler.classList.remove('navbar-toggler-expand');
            nav_popup.classList.remove('navbar-popup-show');
        }
        else {
            nav_toggler.classList.add('navbar-toggler-expand');
            nav_popup.classList.add('navbar-popup-show');
        }
    });

    // close menu popup on mousedown outside of menu popup
    document.addEventListener('mousedown', function(event) {
        if (nav_popup.classList.contains('navbar-popup-show')) {
            contains_login_popup = false;
            node = event.target;

            // check event.target parents for menu popup and menu toggler
            while (node !== null) {
                if (node === nav_popup || node === nav_toggler) {
                    contains_login_popup = true;
                }
                node = node.parentElement;
            }

            // if outside of menu popup, close menu popup and flip chevron
            if (!contains_login_popup) {
                nav_toggler.classList.remove('navbar-toggler-expand');
                nav_popup.classList.remove('navbar-popup-show');
            }
        }
    });
}


function InitMainPopup() {
    let main_popup = document.querySelector('.popup-module');
    let main_popup_contents = document.querySelectorAll('.popup-content');

    if (main_popup) {
        // close popup on mousedown outside of popup
        document.addEventListener('mousedown', function(event) {
            if (MainVue.popup_show) {
                contains_popup_content = false;
                node = event.target;

                // check event.target parents for popup
                while (node !== null) {
                    if (Array.from(main_popup_contents).includes(node)) {
                        contains_popup_content = true;
                    }
                    node = node.parentElement;
                }

                // if outside of menu popup, close menu popup and flip chevron
                if (!contains_popup_content) {
                    MainVue.popup_show = false;
                }
            }
        });
    }
}


// Vue
var MainVue = new Vue({
    el: '#app-main',
    data: {
        search: '',
        show_filter: false,
        filter_type: '',
        filter_from: '',
        filter_distance: null,
        pending: false,
        results: [],
        results_filtered: [],
        result_selected: null,
        result_selected_facilities: [],
        facilities_pending: false,
        popup_show: false,
        popup_info: 'welcome'
    },
    methods: {
        GetMiTalentProgramsUnique: function () {
            MainVue.search = MainVue.search.trim().replace(/\./g, '').replace(/\'/g, '');
            var search_value = MainVue.search;

            if (search_value === '') {
                search_value = 'all';
            }

            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Program_Unique.replace('__SearchVariable__', encodeURI(search_value));

            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    MainVue.results = [];
                    if (response.length > 0) {
                        response.forEach(function (item) {
                            MainVue.results.push(item);
                        });
                    }

                    MainVue.pending = false;
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.pending = true;
        },
        GetMiTalentPrograms: function () {
            MainVue.search = MainVue.search.trim().replace(/\./g, '').replace(/\'/g, '');

            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Program.replace('__SearchVariable__', encodeURI(MainVue.search));

            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    MainVue.results = [];
                    if (response.length > 0) {
                        response.forEach(function (item) {
                            MainVue.results.push(item);
                        });
                    }

                    MainVue.pending = false;
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.pending = true;
        },
        SelectResult: function (result) {
            MainVue.result_selected = result;
            MainVue.LoadFacilities(result.title);
        },
        LoadFacilities: function (course_name) {
            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Program_Facilities.replace('__SearchVariable__', encodeURIComponent(course_name));

            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    MainVue.result_selected_facilities = [];
                    if (response.length > 0) {
                        response.forEach(function (item) {
                            MainVue.result_selected_facilities.push(item);
                        });
                    }

                    MainVue.facilities_pending = false;
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.facilities_pending = true;
        },
        ClearSelectedResult: function () {
            MainVue.result_selected = null;
            MainVue.result_selected_facilities = [];
        },
        FilterResults: function () {
            var build_results = [];

            if (MainVue.filter_type !== '' && MainVue.filter_distance !== null && MainVue.filter_distance_from !== null) {
                MainVue.results.forEach(function (result) {
                    if (result.latitude) {
                        if (parseFloat(MainVue.GetLatLongDistance([result.latitude, result.longitude])) <= parseFloat(MainVue.filter_distance)) {
                            if (result.type === MainVue.filter_type) {
                                build_results.push(result);
                            }
                        }
                    }
                });
                MainVue.results_filtered = build_results;
            }
            else if (MainVue.filter_type !== '') {
                MainVue.results.forEach(function (result) {
                    if (result.type === MainVue.filter_type) {
                        build_results.push(result);
                    }
                });
                MainVue.results_filtered = build_results;
            }
            else if (MainVue.filter_distance !== null && MainVue.filter_distance_from !== null) {
                MainVue.results.forEach(function (result) {
                    if (result.latitude) {
                        if (parseFloat(MainVue.GetLatLongDistance([result.latitude, result.longitude])) <= parseFloat(MainVue.filter_distance)) {
                            build_results.push(result);
                        }
                    }
                });
                MainVue.results_filtered = build_results;
            }
            else {
                MainVue.results_filtered = MainVue.results;
            }
        }
    },
    watch: {
        results: function () {
            MainVue.FilterResults();

            if (MainVue.results.length === 1) {
                MainVue.SelectResult(MainVue.results[0]);
            }
        },
        filter_type: function () {
            MainVue.FilterResults();
        },
        filter_distance: function () {
            MainVue.FilterResults();
        },
        filter_distance_from: function () {
            MainVue.FilterResults();
        }
    }
});