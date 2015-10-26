var app = angular.module('indexApp', [
  "ionic",
  "nemLogging",
  "leaflet-directive"
]);

app.config(['$httpProvider', function($httpProvider) {
          $httpProvider.defaults.useXDomain = true;

          /**
           * Just setting useXDomain to true is not enough. AJAX request are also
           * send with the X-Requested-With header, which indicate them as being
           * AJAX. Removing the header is necessary, so the server is not
           * rejecting the incoming request.
           **/
          delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
]);

app.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('home', { 	url : '/',
						cache : false,
						templateUrl : 'home.html',
						controller : 'homeCtrl'
	}).state('about',{
						url : '/about/',
						templateUrl : 'about.html',				
	}).state('help',{
						url : '/help/',
						templateUrl : 'help.html',
  }).state('query-analisis',{
            url : '/query-analisis/',
            templateUrl : 'query-analisis.html'
  }).state('analisis-satu',{
            url : '/analisis-satu/',
            templateUrl : 'analisis.html',
            controller : 'analisis-satuCtrl'
  }).state('analisis-dua',{
            url : '/analisis-dua/',
            templateUrl : 'analisis.html',
            controller : 'analisis-duaCtrl'
  }).state('analisis-tiga',{
            url : '/analisis-tiga/',
            templateUrl : 'analisis.html',
            controller : 'analisis-tigaCtrl'
  }).state('analisis-empat',{
            url : '/analisis-empat/',
            templateUrl : 'analisis.html',
            controller : 'analisis-empatCtrl'
  }).state('analisis-lima',{
            url : '/analisis-lima/',
            templateUrl : 'analisis.html',
            controller : 'analisis-limaCtrl'
  }).state('analisis-enam',{
            url : '/analisis-enam/',
            templateUrl : 'analisis.html',
            controller : 'analisis-enamCtrl'
  }).state('analisis-tujuh',{
            url : '/analisis-tujuh/',
            templateUrl : 'analisis.html',
            controller : 'analisis-tujuhCtrl'
  }).state('analisis-delapan',{
            url : '/analisis-delapan/',
            templateUrl : 'analisis.html',
            controller : 'analisis-delapanCtrl'
  }).state('analisis-sembilan',{
            url : '/analisis-sembilan/',
            templateUrl : 'analisis.html',
            controller : 'analisis-sembilanCtrl'
  }).state('info-details',{
            url : '/info-details/',
            templateUrl : 'info-details.html'
  });
}]);

app.config(function($urlRouterProvider,$ionicConfigProvider){
    $urlRouterProvider.when('', '/');
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.backButton.text('');
	$ionicConfigProvider.tabs.position('bottom');
});

app.run(function($rootScope,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopover,$location,$http,$ionicPlatform){

	$rootScope.toHome = function() {
		$location.path('/');
	};

	$rootScope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$rootScope.goBack = function() {
		$ionicNavBarDelegate.back();
	};

	$ionicPopover.fromTemplateUrl('popover-account.html', {
		scope: $rootScope,
	}).then(function(popover) {
	    $rootScope.popover = popover;
	});

	$rootScope.openPopover = function($event) {
    	$rootScope.popover.show($event);
	};
	$rootScope.closePopover = function() {
	    $rootScope.popover.hide();
	};

    $rootScope.$on('$destroy', function() {
        $rootSscope.popover.remove();
    });
});

app.controller('panelCtrl',function($scope){

});

app.controller("hometesCtrl", [ '$scope', function($scope) {

     angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 4
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
                }
            });
}]);

app.controller("homeCtrl", [ '$scope', '$http', 'leafletData', '$filter', '$ionicModal', function($scope, $http, leafletData, $filter, $ionicModal) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

  $scope.testku = {
    name : 'NAC',
    koneksi : 'NWF',
    dapur : 'NDPR',
    harga : '1',
    jarak :'1'
  };

  $scope.rangeKu = {};
  $scope.rangeJarakKu = {};
  $scope.hasilFilter = 0;
  

     angular.extend($scope, {
                center: {
                    lat: -6.2780,
                    lng: 106.8030,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#ffdc4d', '#d1874a', '#aa9d3a' ],
                    labels: [ 'Primary Road', 'Secondary Road', 'Residential Road' ]
                },
                layers: {
                    overlays: {
                      jaksel: {
                            name: 'Jaksel',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JakartaSelatanKurang2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                      pr2: {
                            name: 'Primary Road 2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'PrimaryRoadJakselLebih2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                        label: {
                            name: 'Label Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselLabelLebih2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },

                        rr2: {
                            name: 'Residential Road 2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'ResidentialRoadJakartaKurang6RTS',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                        rr: {
                            name: 'Residential Road',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'ResidentialRoadJakartaKurang2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }, 

                         sr: {
                            name: 'Secondary Road',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'SecondaryRoadJakselKurang2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                        pr: {
                            name: 'Primary Road',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'PrimaryRoadJakselKurang2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                        ub: {
                            name: 'UB',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'BakrieJakselKurang2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }

                    }

                }
            });

     $scope.datalama = {},

    
     $http.get("data/data.json").success(function(data, status) {
     //$http.get("hos").success(function(data, status) {
              
        var myIcon = {
                        
            N: L.icon({  
                iconUrl:'img/apt.png',
                iconSize:[25, 25]
            }),
            Y: L.icon({  
                iconUrl:'img/home.png',
                iconSize:[25, 25]
            }),
        };

        $scope.datalama = data;

        angular.extend($scope, {
            geojson: {
                name: 'KosApt',
                type: 'geoJSON',
                data: data,
                style:
                    function (feature) {return {};},
                    pointToLayer: function(feature, latlng) {
                        return new L.marker(latlng, {icon: myIcon[feature.properties.kos]});},
                    onEachFeature: function(feature, layer) {

                        layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                            '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabell+
                            '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                            '</td></tr><tr><th scope="row" width="30"><b>ADD-INFORMATION</b></th><th width="8">:</th><td>' + feature.properties.infolain +
                            '</td></tr><tr><th scope="row" width="30"><b>ADDRESS</b></th><th width="8">:</th><td>' + feature.properties.alamat +
                            '</td></tr><tr><th scope="row" width="30"><b>CONTACT 1</b></th><th width="8">:</th><td>' + feature.properties.kontak +
                            '</td></tr><tr><th scope="row" width="30"><b>CONTACT 2</b></th><th width="8">:</th><td>' + feature.properties.kontaklain +
                            '</td></tr></table>');
                    } 
                }
        });

    });

    
    
    $scope.filterku = function (inputs) {

        var min, max = 0;
        var minj, maxj = 0;

        var filtText1 = inputs.name;
        var filtText2 = inputs.koneksi;
        var filtText3 = inputs.dapur;
        var filtText4 = inputs.harga;

        if (filtText4 == '1'){
            min = 0;
            max = 1000000;
        } else if (filtText4 == '2') {
            min = 1000001;
            max = 5000000;
        }else if (filtText4 == '3') {
            min = 5000001;
            max = 80000000;
        }

        $scope.rangeKu = {
            userMin:min,
            userMax:max
        };

        if (filtText4 == '0') {
            $scope.rangeKu = 0;
        }

        var filtText5 = inputs.jarak;

        if (filtText5 == '1'){
            minj = 0,40;
            maxj = 2,00;
        } else if (filtText5 == '2') {
            minj = 2,001;
            maxj = 5,000;
        }else if (filtText5 == '3') {
            minj = 5,001;
            maxj = 15,000;
        }

        $scope.rangeJarakKu = {
            jarakMin:minj,
            jarakMax:maxj
        };

  
        var data = angular.copy ($scope.datalama);
     
         var myIcon = {
                        
            N: L.icon({  
                iconUrl:'img/apt.png',
                iconSize:[25, 25]
            }),
            Y: L.icon({  
                iconUrl:'img/home.png',
                iconSize:[25, 25]
            }),
        };


        var databaru = $filter('filter')($scope.datalama.features, filtText1);

        if (filtText2) {
            databaru = $filter('filter')(databaru, filtText2);
        };

         if (filtText3) {
            databaru = $filter('filter')(databaru, filtText3);
        };

        if (filtText4) {
            databaru = $filter('rangeFilter')(databaru, $scope.rangeKu);
        };

        if (filtText5) {
            databaru = $filter('rangeJarakFilter')(databaru, $scope.rangeJarakKu);
        }

        $scope.hasilFilter = databaru;
        console.log($scope.rangeKu);
        console.log($scope.rangeJarakKu);
        console.log(databaru);

        data.features = databaru;
        $scope.geojson = {
            name: 'KosApt',
            type: 'geoJSON',
            data: data, 
            style:
                function (feature) {return {};},
                pointToLayer: function(feature, latlng) {
                    return new L.marker(latlng, {icon: myIcon[feature.properties.kos]});},
                onEachFeature: function(feature, layer) {

                    layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                            '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                            '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                            '</td></tr><tr><th scope="row" width="30"><b>ADD-INFORMATION</b></th><th width="8">:</th><td>' + feature.properties.infolain +
                            '</td></tr><tr><th scope="row" width="30"><b>ADDRESS</b></th><th width="8">:</th><td>' + feature.properties.alamat +
                            '</td></tr><tr><th scope="row" width="30"><b>CONTACT 1</b></th><th width="8">:</th><td>' + feature.properties.kontak +
                            '</td></tr><tr><th scope="row" width="30"><b>CONTACT 2</b></th><th width="8">:</th><td>' + feature.properties.kontaklain +
                            '</td></tr></table>');
                } 
        }

        console.log('sukses');

        $scope.modal.hide();
        $scope.modaldetail.hide();
    };

        $ionicModal.fromTemplateUrl ('modal-filter.html', {
            scope : $scope, 
            animation : 'slide-in-up'
            }).then(function (modal){
            $scope.modal = modal;
        });

        $scope.openModalku = function () {
            $scope.modal.show();
        };

        $scope.closeModalKu = function() {
        $scope.modal.hide();
        };

        $ionicModal.fromTemplateUrl ('modal-detail.html', {
            scope : $scope, 
            animation : 'slide-in-up'
            }).then(function (modaldetail){
            $scope.modaldetail = modaldetail;
        });

        $scope.openDetailku = function () {
            $scope.modaldetail.show();
        };

        $scope.closeDetailKu = function() {
        $scope.modaldetail.hide();
        };
        

}])

.filter('rangeFilter', function() {
    return function( items, rangeInfo ) {
        var filtered = [];
        var min = parseInt(rangeInfo.userMin);
        var max = parseInt(rangeInfo.userMax);
        // If time is with the range
        console.log(rangeInfo);
        if (rangeInfo != 0) {
            angular.forEach(items, function(item) {
                // console.log(item.properties);
                if( parseInt(item.properties.hargabulan) >= min && parseInt(item.properties.hargabulan) <= max ) {
                    filtered.push(item);
                }
            });
        } else {
            angular.forEach(items, function(item) {
                if( item.properties.hargabulan == null ) {
                    filtered.push(item);
                    console.log(item.properties);
                }
            });
        };
        return filtered;
    };
})

.filter('rangeJarakFilter', function() {
    return function( items, rangeInfo ) {
        var filteredj = [];
        var min = parseInt(rangeInfo.jarakMin);
        var max = parseInt(rangeInfo.jarakMax);
        // If time is with the range
        console.log(rangeInfo);
        if (rangeInfo != 0) {
            angular.forEach(items, function(item) {
                // console.log(item.properties);
                if (item.properties.hubdist >= min && item.properties.hubdist <= max ) {
                    filteredj.push(item);
                }
            });
        } else {
            angular.forEach(items, function(item) {
                if( item.properties.hubdist == null ) {
                    filteredj.push(item);
                    console.log(item.properties);
                }
            });
        };
        return filteredj;
    };
});


app.controller("analisis-satuCtrl", [ '$scope','$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

    angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#ebd784', '#b8e186', '#4dac26', '#de77ae', '#b5b3a8' ],
                    labels: [ 'Within 2KM', 'Lowest Price', 'Above Lowest Price', 'Outside 2KM', 'No Price Info Available'],
                },

                layers: {
                    overlays: {
                        kota: {
                            name: 'Kota',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KotaJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            },
                            layerOptions: {
                                opacity: 0.85,
                                attribution: "2015 Magys"
                            }
                        },
                      
                        kecamatan: {
                            name: 'Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                       ub: {
                            name: 'UB',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'UB',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                        buffer: {
                            name: 'Buffer 2  KM',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'Buffer2KM',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },

                geojson:{}
        });

    $http.get("data/anls1-dl.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls1-dl.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                dl: {
                    name: 'diluar2km',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });
    
    $http.get("data/anls1-hn.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls1-hn.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                hn: {
                    name: '2kmhargano',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

    $http.get("data/anls1-ht.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls1-ht.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                ht: {
                    name: '2kmhargano',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

    $http.get("data/anls1-htg.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls1-htg.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                htg: {
                    name: '2kmhargatinggi',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

}]);

app.controller("analisis-duaCtrl", [ '$scope','$http','leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

    angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#2b8cbe', '#7bccc4', '#bae4bc', '#f0f9e8' ],
                    labels: [ 'Rp 18.200.001,00 - Rp 71.175.000,00 [12]', 'Rp 2.500.001,00 - Rp 18.200.000,00 [9]', 'Rp 600.000,00 - Rp 2.500.000,00 [16]', 'No Price Info Available [35]' ],
                },
                layers: {
                    overlays: {
                        kota: {
                            name: 'Kota',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KotaJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },
                      
                        kecamatan: {
                            name: 'Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },

                geojson: {}
        });

    $http.get("data/anls2-nh.json").success(function(data, status) {
                 //$http.get("hos").success(function(data, status) {
                          
                    var myIcon = L.icon({  
                            iconUrl:'img/anls2-nh.png',
                            iconSize:[15, 15]
                        })
                   

                    angular.extend($scope.geojson, {
                        nh: {
                            name: 'No Harga',
                            type: 'geoJSON',
                            data: data,
                            style:
                                function (feature) {return {};},
                                pointToLayer: function(feature, latlng) {
                                    return new L.marker(latlng, {icon: myIcon});},
                                onEachFeature: function(feature, layer) {

                                    layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                        '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                        '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                        '</td></tr></table>');
                                } 
                            }
                    });

        });
    
    $http.get("data/anls2-hl.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls2-hl.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                hl: {
                    name: 'Low',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

    $http.get("data/anls2-hm.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls2-hm.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                hm: {
                    name: 'Middle',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

    $http.get("data/anls2-hh.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls2-hh.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                hh: {
                    name: 'High',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

}]);

app.controller("analisis-tigaCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

    angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#ab3910', '#e48e7a' ],
                    labels: [ 'Complete 3 Facilities (AC, Wifi, Kitchen) [4]', 'Not Complete 3 Facilities (AC, Wifi, Kitchen) [68]' ],
                },
                layers: {
                    overlays: {
                        kota: {
                            name: 'Kota',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KotaJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },
                      
                        kecamatan: {
                            name: 'Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },
                geojson: {}
            });

    $http.get("data/anls3-tlf.json").success(function(data, status) {
                 //$http.get("hos").success(function(data, status) {
                          
                    var myIcon = L.icon({  
                            iconUrl:'img/anls3-tlf.png',
                            iconSize:[15, 15]
                        })
                   

                    angular.extend($scope.geojson, {
                        tlf: {
                            name: 'Tidak Lengkap 3 Fasilitas',
                            type: 'geoJSON',
                            data: data,
                            style:
                                function (feature) {return {};},
                                pointToLayer: function(feature, latlng) {
                                    return new L.marker(latlng, {icon: myIcon});},
                                onEachFeature: function(feature, layer) {

                                    layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                        '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                        '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                                        '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                        '</td></tr></table>');
                                } 
                            }
                    });

        });
    
    $http.get("data/anls3-lf.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls3-lf.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                lf: {
                    name: 'Lengkap 3 Fasilitas',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

}]);

app.controller("analisis-empatCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

    angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#5e3c99', '#e66101' ],
                    labels: [ 'Apartment that has AC [14]', 'Boarding House that has AC [9]' ],
                },
                layers: {
                    overlays: {
                        kota: {
                            name: 'Kota',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KotaJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },
                      
                        kecamatan: {
                            name: 'Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },
                    }
                },
                geojson: {}
            });

    $http.get("data/anls4-pka.json").success(function(data, status) {
                 //$http.get("hos").success(function(data, status) {
                          
                    var myIcon = L.icon({  
                            iconUrl:'img/anls4-pka.png',
                            iconSize:[15, 15]
                        })
                   

                    angular.extend($scope.geojson, {
                        pka: {
                            name: 'Kos AC',
                            type: 'geoJSON',
                            data: data,
                            style:
                                function (feature) {return {};},
                                pointToLayer: function(feature, latlng) {
                                    return new L.marker(latlng, {icon: myIcon});},
                                onEachFeature: function(feature, layer) {

                                    layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias +
                                        '</td></tr><tr><th scope="row" width="30"><b>TYPE</b></th><th width="8">:</th><td>' + feature.properties.kos + 
                                        '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                        '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                                        '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                        '</td></tr></table>');
                                } 
                            }
                    });

        });
    
    $http.get("data/anls4-paa.json").success(function(data, status) {
         //$http.get("hos").success(function(data, status) {
                  
            var myIcon = L.icon({  
                    iconUrl:'img/anls4-paa.png',
                    iconSize:[15, 15]
                })
           

            angular.extend($scope.geojson, {
                paa: {
                    name: 'Apartemen AC',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon});},
                        onEachFeature: function(feature, layer) {

                            layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias + 
                                '</td></tr><tr><th scope="row" width="30"><b>TYPE</b></th><th width="8">:</th><td>' + feature.properties.kos +
                                '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                '</td></tr><tr><th scope="row" width="30"><b>FACILITIES</b></th><th width="8">:</th><td>' + feature.properties.fasilitas +
                                '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                '</td></tr></table>');
                        } 
                    }
            });

        });

}]);

app.controller("analisis-limaCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

     angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#c51b8a', '#fa9fb5', '#fde0dd' ],
                    labels: [ 'First Highest Price [9]', 'Second Highest Price [7]', 'Third Highest Price [5]' ],
                },
                layers: {
                    overlays: {
                      kota: {
                            name: 'Kota',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KotaJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                     kecamatan: {
                            name: 'Kecamatan',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'KecamatanJakselAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      LBL: {
                            name: 'Label Analisis',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'LblAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },


                    }
                },
                geojson: {}
            });
    $http.get("data/anls5-his.json").success(function(data, status) {
                 //$http.get("hos").success(function(data, status) {
                          
                    var myIcon = {
                                    
                        HT1: L.icon({  
                            iconUrl:'img/anls5-his1.png',
                            iconSize:[15, 15]
                        }),
                        HT2: L.icon({  
                            iconUrl:'img/anls5-his2.png',
                            iconSize:[15, 15]
                        }),
                        HT3: L.icon({  
                            iconUrl:'img/anls5-his3.png',
                            iconSize:[15, 15]
                        }),
                    };
                   

                    angular.extend($scope.geojson, {
                        his: {
                            name: 'Highest in Subdistrict',
                            type: 'geoJSON',
                            data: data,
                            style:
                                function (feature) {return {};},
                                pointToLayer: function(feature, latlng) {
                                    return new L.marker(latlng, {icon: myIcon[feature.properties.golharga]});},
                                onEachFeature: function(feature, layer) {

                                    layer.bindPopup('<table><tr><th scope="row" width="20"><b>NAME</b></th><th width="8">:</th><td>' + feature.properties.alias +
                                        '</td></tr><tr><th scope="row" width="30"><b>PRICE</b></th><th width="8">:</th><td>' + feature.properties.hargalabel+
                                        '</td></tr><tr><th scope="row" width="30"><b>DISTANCE FROM UB</b></th><th width="8">:</th><td>' + feature.properties.hubdist + ' KM' +
                                        '</td></tr></table>');
                                } 
                            }
                    });

        });

}]);

app.controller("analisis-enamCtrl", [ '$scope', function($scope) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

     angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#31a354', '#a1d99b', '#e5f5e0' ],
                    labels: [ '14 - 19 Rent Room', '8 - 13 Rent Room', '1 - 7 Rent Room' ],
                },
                layers: {
                    overlays: {
                      IK1: {
                            name: 'Indekos Kec1',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosPerKec1',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                     IK2: {
                            name: 'Indekos Kec2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosPerKec2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      IK3: {
                            name: 'Indekos Kec3',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosPerKec3',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      LBL: {
                            name: 'Label Analisis',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'LblAnalisis',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                }
            });

}]);

app.controller("analisis-tujuhCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

     angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#000000', '#ffffff','#d95f0e', '#fec44f', '#fff7bc' ],
                    labels: [ 'Amount of Rent Room with Kitchen,', 'Tap on The Square for Details<br/><br/>', '4 - 9 Rent Room', '2 - 3 Rent Room', '0 - 1 Rent Room' ],
                },
                layers: {
                    overlays: {
                      IDK1: {
                            name: 'Indekos Dapur Kec1',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosDapurPerKec1',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                     IDK2: {
                            name: 'Indekos Dapur Kec2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosDapurPerKec2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      IDK3: {
                            name: 'Indekos Dapur Kec3',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosDapurPerKec3',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                       LBL2: {
                            name: 'Label Analisis 2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'LblAnalisis2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },
                geojson: {}
            });

            $http.get("data/anls7-dapur.json").success(function(data, status) {
          
            var myIcon = {
                            
                1: L.icon({  
                    iconUrl:'img/pn.png',
                    iconSize:[27, 27]
                }),
                2: L.icon({  
                    iconUrl:'img/pn.png',
                    iconSize:[28, 28]
                }),
                3: L.icon({  
                    iconUrl:'img/pn.png',
                    iconSize:[29, 29]
                }),
                9: L.icon({  
                    iconUrl:'img/pn.png',
                    iconSize:[35, 35]
                }),
            };
      
            angular.extend($scope.geojson, {
                dapur: {
                    name: 'DapurSym',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon[feature.properties.jmldpr]});},
                        onEachFeature: function(feature, layer) {
                            layer.bindPopup(feature.properties.jmldpr+ " room/s");
                        } 
                    }
                
            });
        });

}]);

app.controller("analisis-delapanCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

       angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [ '#000000', '#ffffff', '#d73027', '#fc8d59', '#fee090' ],
                    labels: [ 'Amount of Rent Room with Wifi,', 'Tap on The Square for Details<br/><br/>', '4 - 5 Rent Room', '2 - 3 Rent Room', '0 - 1 Rent Room' ],
                },
                layers: {
                    overlays: {
                      IWK1: {
                            name: 'Indekos Wifi Kec1',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosWifiPerKec1',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                     IWK2: {
                            name: 'Indekos Wifi Kec2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosWifiPerKec2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      IWK3: {
                            name: 'Indekos Wifi Kec3',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosWifiPerKec3',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                       LBL2: {
                            name: 'Label Analisis 2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'LblAnalisis2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },
                geojson: {}
            });

        $http.get("data/anls8-wifi.json").success(function(data, status) {
          
            var myIcon = {
                            
                1: L.icon({  
                    iconUrl:'img/wf1.png',
                    iconSize:[30, 30]
                }),
                2: L.icon({  
                    iconUrl:'img/wf2.png',
                    iconSize:[30, 30]
                }),
                4: L.icon({  
                    iconUrl:'img/wf3.png',
                    iconSize:[30, 30]
                }),
            };
      
            angular.extend($scope.geojson, {
                wifi: {
                    name: 'WifiSym',
                    type: 'geoJSON',
                    data: data,
                    style:
                        function (feature) {return {};},
                        pointToLayer: function(feature, latlng) {
                            return new L.marker(latlng, {icon: myIcon[feature.properties.jmlwf]});},
                        onEachFeature: function(feature, layer) {
                            layer.bindPopup(feature.properties.jmlwf+ " room/s");
                        } 
                    }
                
            });
        });

}]);

app.controller("analisis-sembilanCtrl", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

  var host = "http://localhost:8080/cgi-bin/mapserv.exe?";
  var mapfile = "map=C:\\ms4w\\apps\\indekosjaksel\\magys.map&";
  var wms_server = host + mapfile;

     angular.extend($scope, {
                center: {
                    lat: -6.2900,
                    lng: 106.8020,
                    zoom: 12
                },
                legend: {
                    position: 'bottomleft',
                    colors: [  '#000000','#ffffff','#2c7fb8', '#7fcdbb', '#edf8b1' ],
                    labels: [ 'Amount of Rent Room with AC,', 'Tap on The Square for Details<br/><br/>','5 - 6 Rent Room', '3 - 4 Rent Room', '0 - 2 Rent Room' ],
                },
                layers: {
                    overlays: {
                      IAK1: {
                            name: 'Indekos AC Kec1',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosACPerKec1',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                      },
                      
                     IAK2: {
                            name: 'Indekos AC Kec2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosACPerKec2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                      IAK3: {
                            name: 'Indekos AC Kec3',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'JumlahIndekosACPerKec3',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        },

                       LBL2: {
                            name: 'Label Analisis 2',
                            url: wms_server,
                            type: 'wms',
                            visible: true,
                            layerParams: {
                                layers: 'LblAnalisis2',
                                format: 'png',
                                srs: "EPSG:4326",
                                transparent: true,
                                showOnSelector: false
                            }
                        }
                    }
                },
                geojson: {}
            });


            $http.get("data/anls9-ac.json").success(function(data, status) {
          
                var myIcon = {
                                
                    1: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[35, 25]
                    }),
                    2: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[37, 27]
                    }),
                    3: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[39, 29]
                    }),
                    4: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[41, 31]
                    }),
                    5: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[43, 33]
                    }),
                    6: L.icon({  
                        iconUrl:'img/ase.png',
                        iconSize:[45, 35]
                    }),
                };
          
                angular.extend($scope.geojson, {
                    ase: {
                        name: 'AseSym',
                        type: 'geoJSON',
                        data: data,
                        style:
                            function (feature) {return {};},
                            pointToLayer: function(feature, latlng) {
                                return new L.marker(latlng, {icon: myIcon[feature.properties.jmlac]});},
                            onEachFeature: function(feature, layer) {
                                layer.bindPopup(feature.properties.jmlac+ " room/s");
                            } 
                        }
                    
                });
            });

}]);