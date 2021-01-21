// IE11 / Polyfill Array.from fix - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
if(!Array.from){Array.from=function(){var toStr=Object.prototype.toString;var isCallable=function(fn){return typeof fn==="function"||toStr.call(fn)==="[object Function]"};var toInteger=function(value){var number=Number(value);if(isNaN(number)){return 0}if(number===0||!isFinite(number)){return number}return(number>0?1:-1)*Math.floor(Math.abs(number))};var maxSafeInteger=Math.pow(2,53)-1;var toLength=function(value){var len=toInteger(value);return Math.min(Math.max(len,0),maxSafeInteger)};return function from(arrayLike){var C=this;var items=Object(arrayLike);if(arrayLike==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")} var mapFn=arguments.length>1?arguments[1]:void undefined;var T;if(typeof mapFn!=="undefined"){if(!isCallable(mapFn)){throw new TypeError("Array.from: when provided, the second argument must be a function")} if(arguments.length>2){T=arguments[2]}} var len=toLength(items.length);var A=isCallable(C)?Object(new C(len)):new Array(len);var k=0;var kValue;while(k<len){kValue=items[k];if(mapFn){A[k]=typeof T==="undefined"?mapFn(kValue,k):mapFn.call(T,kValue,k)}else{A[k]=kValue}k+=1} A.length=len;return A}}()}

// IE11 / Polyfill URLSearchParams() fix - https://github.com/jerrybendy/url-search-params-polyfill/blob/master/index.js
(function(self){'use strict';var nativeURLSearchParams=(self.URLSearchParams&&self.URLSearchParams.prototype.get)?self.URLSearchParams:null,isSupportObjectConstructor=nativeURLSearchParams&&(new nativeURLSearchParams({a:1})).toString()==='a=1',decodesPlusesCorrectly=nativeURLSearchParams&&(new nativeURLSearchParams('s=%2B').get('s')==='+'),__URLSearchParams__="__URLSearchParams__",encodesAmpersandsCorrectly=nativeURLSearchParams?(function(){var ampersandTest=new nativeURLSearchParams();ampersandTest.append('s',' &');return ampersandTest.toString()==='s=+%26';})():true,prototype=URLSearchParamsPolyfill.prototype,iterable=!!(self.Symbol&&self.Symbol.iterator);if(nativeURLSearchParams&&isSupportObjectConstructor&&decodesPlusesCorrectly&&encodesAmpersandsCorrectly){return;} function URLSearchParamsPolyfill(search){search=search||"";if(search instanceof URLSearchParams||search instanceof URLSearchParamsPolyfill){search=search.toString();} this[__URLSearchParams__]=parseToDict(search);} prototype.append=function(name,value){appendTo(this[__URLSearchParams__],name,value);};prototype['delete']=function(name){delete this[__URLSearchParams__][name];};prototype.get=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name][0]:null;};prototype.getAll=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name].slice(0):[];};prototype.has=function(name){return name in this[__URLSearchParams__];};prototype.set=function set(name,value){this[__URLSearchParams__][name]=[''+value];};prototype.toString=function(){var dict=this[__URLSearchParams__],query=[],i,key,name,value;for(key in dict){name=encode(key);for(i=0,value=dict[key];i<value.length;i++){query.push(name+'='+encode(value[i]));}} return query.join('&');};var forSureUsePolyfill=!decodesPlusesCorrectly;var useProxy=(!forSureUsePolyfill&&nativeURLSearchParams&&!isSupportObjectConstructor&&self.Proxy);Object.defineProperty(self,'URLSearchParams',{value:(useProxy?new Proxy(nativeURLSearchParams,{construct:function(target,args){return new target((new URLSearchParamsPolyfill(args[0]).toString()));}}):URLSearchParamsPolyfill)});var USPProto=self.URLSearchParams.prototype;USPProto.polyfill=true;USPProto.forEach=USPProto.forEach||function(callback,thisArg){var dict=parseToDict(this.toString());Object.getOwnPropertyNames(dict).forEach(function(name){dict[name].forEach(function(value){callback.call(thisArg,value,name,this);},this);},this);};USPProto.sort=USPProto.sort||function(){var dict=parseToDict(this.toString()),keys=[],k,i,j;for(k in dict){keys.push(k);} keys.sort();for(i=0;i<keys.length;i++){this['delete'](keys[i]);} for(i=0;i<keys.length;i++){var key=keys[i],values=dict[key];for(j=0;j<values.length;j++){this.append(key,values[j]);}}};USPProto.keys=USPProto.keys||function(){var items=[];this.forEach(function(item,name){items.push(name);});return makeIterator(items);};USPProto.values=USPProto.values||function(){var items=[];this.forEach(function(item){items.push(item);});return makeIterator(items);};USPProto.entries=USPProto.entries||function(){var items=[];this.forEach(function(item,name){items.push([name,item]);});return makeIterator(items);};if(iterable){USPProto[self.Symbol.iterator]=USPProto[self.Symbol.iterator]||USPProto.entries;} function encode(str){var replace={'!':'%21',"'":'%27','(':'%28',')':'%29','~':'%7E','%20':'+','%00':'x00'};return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g,function(match){return replace[match];});} function decode(str){return str.replace(/[ +]/g,'%20').replace(/(%[a-f0-9]{2})+/ig,function(match){return decodeURIComponent(match);});} function makeIterator(arr){var iterator={next:function(){var value=arr.shift();return{done:value===undefined,value:value};}};if(iterable){iterator[self.Symbol.iterator]=function(){return iterator;};} return iterator;} function parseToDict(search){var dict={};if(typeof search==="object"){if(isArray(search)){for(var i=0;i<search.length;i++){var item=search[i];if(isArray(item)&&item.length===2){appendTo(dict,item[0],item[1]);}else{throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");}}}else{for(var key in search){if(search.hasOwnProperty(key)){appendTo(dict,key,search[key]);}}}}else{if(search.indexOf("?")===0){search=search.slice(1);} var pairs=search.split("&");for(var j=0;j<pairs.length;j++){var value=pairs[j],index=value.indexOf('=');if(-1<index){appendTo(dict,decode(value.slice(0,index)),decode(value.slice(index+1)));}else{if(value){appendTo(dict,decode(value),'');}}}} return dict;} function appendTo(dict,name,value){var val=typeof value==='string'?value:(value!==null&&value!==undefined&&typeof value.toString==='function'?value.toString():JSON.stringify(value));if(name in dict){dict[name].push(val);}else{dict[name]=[val];}} function isArray(val){return!!val&&'[object Array]'===Object.prototype.toString.call(val);}})(typeof global!=='undefined'?global:(typeof window!=='undefined'?window:this));


// OnLoad Run
window.addEventListener('load', function() {
    CheckForIE();

    InitNavigationMenu();
    InitMainPopup();

    if (!HasWelcomePopupDisplayed()) {
        MainVue.popup_show = true;
        WelcomePopupHasDisplayed();
    }

    GetUrlParams();

    MainVue.LoadMapboxMap();

    InitFilterFromTypeahead();

    if (typeof MainVue.urlParams.facilityid !== 'undefined') {
        MainVue.GetMiTalentFacilityById(MainVue.urlParams.facilityid);
    }
    else {
        MainVue.GetMiTalentFacilities();
    }
});


function CheckForIE() {
    if (window.document.documentMode) {
        alert('IE Browser Is Not Supported!');
    }
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


function GetUrlParams() {
	var urlParams = new URLSearchParams(window.location.search);
	var entries = urlParams.entries();
	var entriesDict = {};
	var entriesArray = Array.from(entries);
	entriesArray.forEach(function(entry) {
		entriesDict[entry[0]] = entry[1];
	});
	MainVue.urlParams = entriesDict;
}


function InitFilterFromTypeahead() {
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    // https://docs.mapbox.com/help/glossary/geocoding-api/
    document.getElementById('input-filter-from').addEventListener('keyup', function () {
        delay(function () {
            MainVue.filter_from_typeahead_results = [];
            if (document.getElementById('input-filter-from').value.length > 0) {
                let request = new XMLHttpRequest();

                var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/michigan ' + encodeURI(document.getElementById('input-filter-from').value) + '.json?country=US&access_token=' + MainVue.mapbox_token;

                request.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let response = JSON.parse(this.responseText);
                        if (response.features.length > 0) {
                            response.features.forEach(function (item) {
                                MainVue.filter_from_typeahead_results.push(item);
                            });
                        }
                        else {
                            MainVue.filter_from_typeahead_results = [];
                        }
                    }
                    else {
                        MainVue.filter_distance_from = null;
                    }
                }

                request.open("GET", url, true);
                request.send();
            }
        }, 300);
    });
}


function HasWelcomePopupDisplayed() {
    var wel_pop_seen = GetCookie('welcomepopupseen');

    if (wel_pop_seen === 'true') {
        return true;
    }
    
    return false;
}

function WelcomePopupHasDisplayed() {
    document.cookie = 'welcomepopupseen=true'
}

function GetCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




// Vue
var MainVue = new Vue({
    el: '#app-main',
    data: {
        urlParams: null,
        mapbox_token: 'pk.eyJ1Ijoiam9lZGJucyIsImEiOiJjangzZjhhb2UwdXd2M3pvNHlnY2RueTk3In0.XtTyt6DTMRb4hXfJdbbzyg',
        search: '',
        show_filter: false,
        filter_type: '',
        filter_from: '',
        filter_distance: '',
        filter_distance_from: null,
        set_filter_distance_from: false,
        filter_from_typeahead_results: [],
        pending: false,
        results: [],
        results_filtered: [],
        result_selected: null,
        result_selected_courses: [],
        courses_pending: false,
        result_selected_contacts: [],
        contacts_pending: false,
        map: null,
        map_markers: [],
        map_distance_marker: null,
        popup_show: false,
        popup_info: 'welcome'
    },
    methods: {
        GetMiTalentFacilities: function () {
            MainVue.search = MainVue.search.trim().replace(/\./g, '').replace(/\'/g, '');

            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Facility.replace('__SearchVariable__', encodeURI(MainVue.search));

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
                    MainVue.LoadMapboxMap_markers(MainVue.results_filtered);
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.pending = true;
        },
        GetMiTalentFacilityById: function (id) {
            MainVue.search = MainVue.search.trim().replace(/\./g, '').replace(/\'/g, '');

            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Facility_Id.replace('__SearchVariable__', encodeURI(id));

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
                    MainVue.LoadMapboxMap_markers(MainVue.results_filtered);
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.pending = true;
        },
        LoadMapboxMap: function () {
            mapboxgl.accessToken = MainVue.mapbox_token;

            MainVue.map = new mapboxgl.Map({
                container: 'map-main',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-88.8525094, 44.55], // starting position
                zoom: 6 // starting zoom
            });

            MainVue.map.on('click', function (e) {
                if (MainVue.set_filter_distance_from) {
                    MainVue.filter_distance_from = [e.lngLat.lat, e.lngLat.lng];
                    MainVue.SetDistanceCenterMarker(e.lngLat.lat, e.lngLat.lng);
                    MainVue.set_filter_distance_from = false;
                    MainVue.FilterResults();
                }
            });

            // Add zoom and rotation controls to the map.
            MainVue.map.addControl(new mapboxgl.NavigationControl());
        },
        LoadMapboxMap_markers: function (markers) {
            if (markers === null || typeof (markers) === "undefined") { markers = [] }

            MainVue.ClearSelectedResult();
            MainVue.ClearMapboxMap_markers();

            markers.forEach(function (marker) {
                if (marker.latitude !== '') {
                    var el = document.createElement('div');
                    el.id = 'marker_' + marker.id;
                    el.className = 'marker';
                    el.style.backgroundImage = 'url(\'./static/img/map-marker-icon-sml.png\')';
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.addEventListener('click', function () {
                        if (!MainVue.set_filter_distance_from) {
                            MainVue.SelectResult(marker);
                        }
                    });

                    var newMarker = new mapboxgl.Marker(el)
                        .setLngLat([marker.longitude, marker.latitude])
                        .addTo(MainVue.map);

                    MainVue.map_markers.push(newMarker);
                }
            });
        },
        FlyToLocation: function (latlong, zoom) {
            if (typeof (latlong) === "undefined") { latlong = [-86.4525094, 44.55] }
            if (typeof (zoom) === "undefined") { zoom = 5 }

            MainVue.map.flyTo({
                center: latlong,
                zoom: zoom
            });
        },
        SelectResult: function (result) {
            MainVue.HighlightMapboxMapMarker('marker_' + result.id);
            MainVue.SetSelectedResultById(result.id);
        },
        HighlightMapboxMapMarker: function (marker_id) {
            MainVue.ClearSelectedMapboxMarker();

            var newSelectedResult = document.querySelector('[data-result-id="' + marker_id + '"]');
            if (newSelectedResult !== null) {
                newSelectedResult.setAttribute('data-result-selected', 'true');
            }

            var newSelectedMarker = document.getElementById(marker_id);
            if (newSelectedMarker !== null) {
                newSelectedMarker.style.backgroundImage = 'url(\'./static/img/map-marker-icon-sml-red.png\')';
                newSelectedMarker.setAttribute('data-marker-selected', 'true');
            }
        },
        ClearSelectedMapboxMarker: function () {
            var currentSelectedResult = document.querySelector('[data-result-selected="true"]');
            if (currentSelectedResult !== null) {
                currentSelectedResult.setAttribute('data-result-selected', 'false');
            }

            var currentSelectedMarker = document.querySelector('[data-marker-selected="true"]');
            if (currentSelectedMarker !== null) {
                currentSelectedMarker.style.backgroundImage = 'url(\'./static/img/map-marker-icon-sml.png\')';
                currentSelectedMarker.setAttribute('data-marker-selected', 'false');
            }
        },
        SetDistanceCenterMarker: function (setLat, setLong) {
            MainVue.ClearDistanceCenterMarker();

            MainVue.filter_distance_from = [setLat, setLong];

            var el = document.createElement('div');
            el.id = 'marker_DistanceFromCenter';
            el.className = 'marker-distance-pin';
            el.style.backgroundImage = 'url(\'./static/img/map-marker-icon-sml-pin.png\')';
            el.style.width = '20px';
            el.style.height = '20px';

            MainVue.map_distance_marker = new mapboxgl.Marker(el, { draggable: true }).setLngLat([setLong, setLat]).addTo(MainVue.map);

            function onDragEnd() {
                var lngLat = MainVue.map_distance_marker.getLngLat();
                MainVue.SetDistanceCenterMarker(lngLat.lat, lngLat.lng);
            }

            MainVue.map_distance_marker.on('dragend', onDragEnd);
        },
        ClearDistanceCenterMarker: function (marker_id) {
            if (MainVue.map_distance_marker) {
                MainVue.map_distance_marker.remove();
                MainVue.map_distance_marker = null;
            }
        },
        SetSelectedResultById: function (result_id) {
            MainVue.ClearSelectedResult();

            MainVue.results_filtered.forEach(function (result) {
                if (result.id == result_id) {
                    MainVue.result_selected = result;
                    MainVue.LoadContacts(result_id);
                    MainVue.LoadCourses(result_id);
                }
            });
        },
        LoadCourses: function (facilityId) {
            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Facility_Programs.replace('__SearchVariable__', encodeURI(facilityId));

            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    MainVue.result_selected_courses = [];
                    if (response.length > 0) {
                        response.forEach(function (item) {
                            MainVue.result_selected_courses.push(item);
                        });
                    }

                    MainVue.courses_pending = false;
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.courses_pending = true;
        },
        LoadContacts: function (facilityId) {
            let request = new XMLHttpRequest();

            var url = app_environment.SAA_Facility_Contacts.replace('__SearchVariable__', encodeURI(facilityId));

            request.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    MainVue.result_selected_contacts = [];
                    if (response.length > 0) {
                        response.forEach(function (item) {
                            MainVue.result_selected_contacts.push(item);
                        });
                    }

                    MainVue.contacts_pending = false;
                }
            }

            request.open("GET", url, true);
            request.send();

            MainVue.contacts_pending = true;
        },
        ClearSelectedResult: function () {
            MainVue.result_selected = null;
            MainVue.result_selected_courses = [];
        },
        ClearMapboxMap_markers: function () {
            MainVue.HighlightMapboxMapMarker();

            while (MainVue.map_markers.length > 0) {
                Array.from(MainVue.map_markers).forEach(function (marker) {
                    marker.remove();
                    MainVue.map_markers.shift();
                });
            }
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

            MainVue.LoadMapboxMap_markers(MainVue.results_filtered);
        },
        GetLatLongDistance: function (latLongSet1) {
            var R = 6371e3; // metres
            var φ1 = MainVue.DegreesToRadians(latLongSet1[0]);
            var φ2 = MainVue.DegreesToRadians(MainVue.filter_distance_from[0]);
            var Δφ = MainVue.DegreesToRadians((MainVue.filter_distance_from[0] - latLongSet1[0]));
            var Δλ = MainVue.DegreesToRadians((MainVue.filter_distance_from[1] - latLongSet1[1]));

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            return (d / 1609.344).toFixed(2);
        },
        DegreesToRadians: function (degrees) {
            var pi = Math.PI;
            return degrees * (pi / 180);
        },
        ToggleFilter: function () {
            MainVue.show_filter = !MainVue.show_filter;
            MainVue.filter_type = '';
            MainVue.filter_distance = null;
            MainVue.filter_distance_from = null;
            MainVue.ClearDistanceCenterMarker();
        },
        ClearFilter: function () {
            // document.getElementById('input-filter-from').value = '';
            MainVue.filter_type = '';
            MainVue.filter_distance = '';
            MainVue.filter_distance_from = null;
            MainVue.filter_from = '';
            MainVue.filter_from_typeahead_results = [];
            MainVue.ClearDistanceCenterMarker();
            MainVue.FilterResults();
        }
    },
    watch: {
        results: function () {
            MainVue.FilterResults();

            if (MainVue.results.length === 1) {
                MainVue.SelectResult(MainVue.results[0]);
            }
        }
    }
});