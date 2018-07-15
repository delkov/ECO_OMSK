angular.module('movieApp.controllers',['ui.grid','highcharts-ng', 'ui.grid.selection', 'ui.grid.exporter','moment-picker'])
.value('myVars', {
    exportData:0   // GLOBAL STORE FOR VARIABLES
})


// REAL-TIME TAB
.controller('MovieListController',function($interval, $scope,$state,$window,Movie, NoiseFactory, $http, uiGridConstants){
$scope.gridOptions = { data: {}, 

                       enableVerticalScrollbar: 1,

                       columnDefs: [
                       { field: 'time_track', displayName: 'Время ',type: 'date',cellFilter: 'date:\'yyyy-MM-dd H:mm:ss\'', width: 160},
                       // { field: 'track', displayName: 'Track', width: 80},
                       { field: 'icao', displayName: 'ICAO', width: 80},
                       { field: 'type', displayName: 'Самолет', width: 170},
                       { field: 'operator', displayName: 'Авиакомпания', width: 170},
                       { field: 'callsign', displayName: 'Позывной', width: 100},
                       { field: 'fromairport', displayName: 'Откуда', width: 100},
                       { field: 'toairport', displayName: 'Куда', width: 100},
                       { field: 'altitude', displayName: 'Высота', width: 80 },
                       { field: 'speed', displayName: 'Скорость', width: 80 },
                       { field: 'angle', displayName: 'Курс', width: 80 },
                       { field: 'latitude', displayName: 'Широта', width: 110 },
                       { field: 'longitude', displayName: 'Долгота', width: 110 },
                       { field: 'vertical_speed', displayName: 'Верт. скорость', width: 120 },
                       { field: 'distance_1', displayName: 'Расстояние', width: 100,       sort: {
                         direction: uiGridConstants.ASC,
                         priority: 1
                       }}
                       ],
                       showGridFooter: true,
                       gridFooterTemplate: "<div class=\"ui-grid-footer-info ui-grid-grid-footer\"><span>Total {{grid.rows.length}}</span></div>"
                    }



          var entry = Movie.query(function() {
          $scope.gridOptions.data=entry;
        }); // get() returns a single entry


    $interval(
        function() {
          var entry = Movie.query(function() {
          $scope.gridOptions.data=entry;
        }); // get() returns a single entry
    },1000);  


// ONCE
          // var entry = Movie.query(function() {
          //   $scope.gridOptions.data=entry;
          // });



Highcharts.setOptions({
            lang: {
                loading: 'Загрузка...',
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
                exportButtonTitle: "Экспорт",
                printButtonTitle: "Печать",
                rangeSelectorFrom: "С",
                rangeSelectorTo: "По",
                rangeSelectorZoom: "Период",
                downloadPNG: 'Скачать PNG',
                downloadJPEG: 'Скачать JPEG',
                downloadPDF: 'Скачать PDF',
                downloadSVG: 'Скачать SVG',
                printChart: 'Напечатать график'
            }
    });

    // CHARTS
    $scope.chartConfig = {
  

      

        chartType: 'stock',
        chart: {
            type: 'areaspline',
            threshold: null,
            tooltip: {
              valueDecimals: 2
            },
          events: {
            load: function () {
            // set up the updating of the chart each second
              var series = this.series[0];
            
              // FOR CONTINIOUS GOING 
              // setInterval(function () {
              //   $http.get('http://localhost:3000/noise_data').then(function (result) {
              //     // $scope.NoiseRealData = result;
              //     console.log(result)
              //     series.addPoint([result.data[0][0], result.data[0][1]], true, true);
              //     $scope.chartConfig.series[0].name=result.data[0][2];
              //   });
              // }, 1000);
            
              // static update each 10s
              setInterval(function () {
                $http.get('http://localhost:3000/noise_data_last_5m').then(function (result) {
                  $scope.Noise_Last_5m = result;
                  $scope.chartConfig.series=[{
                  data: $scope.Noise_Last_5m.data,
                  id: 'Level'
                }]
                });
              }, 9000);
            }
          }
        },

        navigator: {
            enabled: true
        },
        rangeSelector: {
          buttons: [{
            count: 1,
            type: 'minute',
            text: '1Мин'
        }, {
            count: 3,
            type: 'minute',
            text: '3Мин'
        }, {
          count:5,
            type: 'minute',
            text: '5Мин'
        }],
          inputEnabled: false
          // selected: 0
        },
        title: {
            text: 'Станция шума (обн.каждые 10с)'
        },
        credits:{"enabled":false},
        legend: {
          enabled: true,
          align: 'right',
          // backgroundColor: '#FCFFC5',
          borderColor: 'white',
          borderWidth: 0,
          layout: 'vertical',
          verticalAlign: 'top',
          y: 100,
          // shadow: true
        },
        series: [{
          fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          data: [[]],
          name: 'Уровень шума',
          id: 'Level',
        }]
    }

// load once at the beginning
$http.get('http://localhost:3000/noise_data_last_5m').then(function (result) {
      $scope.Noise_Last_5m = result;
      $scope.chartConfig.series=[{
      data: $scope.Noise_Last_5m.data,
      id: 'Level'
      }]
});
}).






// NOISE TAB
controller('NoiseController',function($scope,$state,$stateParams,$interval,$http,$filter,uiGridConstants){
    $scope.gridOptions = {
         data: {}, 
         // enableVerticalScrollbar: 1,
         enableFiltering: true,
         columnDefs: [
         { field: 'time_noise', displayName: 'Время',type: 'date',cellFilter: 'date:\'yyyy-MM-dd H:mm:ss\'', width: '12%', enableFiltering: true, 
          sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }},
         { field: 'base_name', displayName: 'Станция', width: '4%'},
         { field: 'slow', displayName: 'Уровень', width: '4%'},
         { field: 'track', displayName: 'Трек', width: '4%'},
         { field: 'aircraft_time', displayName: 'Время самолета', type: 'date',cellFilter: 'date:\'yyyy-MM-dd H:mm:ss\'', width: '9%'},
         { field: 'icao', displayName: 'ICAO', width: '4%'},
         { field: 'type', displayName: 'Самолет', width: '9%'},
         { field: 'operator', displayName: 'Авиакомпания', width: '10%'},
         { field: 'callsign', displayName: 'Позывной', width: '4%'},
         { field: 'fromairport', displayName: 'Откуда', width: '4%'},
         { field: 'toairport', displayName: 'Куда', width: '4%'},
         { field: 'altitude', displayName: 'Высота', width: '4%', enableFiltering: false},
         { field: 'speed', displayName: 'Скорость', width: '4%', enableFiltering: false},
         { field: 'angle', displayName: 'Курс', width: '3%', enableFiltering: false},
         { field: 'longitude', displayName: 'Долгота', width: '5%', enableFiltering: false},
         { field: 'latitude', displayName: 'Широта', width: '5%', enableFiltering: false},
         { field: 'vertical_speed', displayName: 'Верт. скорость', width: '6%', enableFiltering: false},
         { field: 'distance_1', displayName: 'Расстояние', width: '4%', enableFiltering: false},
         ],

        enableGridMenu: true,
        enableSelectAll: true,
        // exporterMenuPdf: false,
        exporterCsvFilename: 'myFile.csv',

        
        // exporterPdfDefaultStyle: {fontSize: 9},
        // exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        // exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        // exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        // exporterPdfFooter: function ( currentPage, pageCount ) {
        //   return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        // },
        // exporterPdfCustomFormatter: function ( docDefinition ) {
        //   docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        //   docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        //   return docDefinition;
        // },
        // exporterPdfOrientation: 'portrait',
        // exporterPdfPageSize: 'LETTER',
        // exporterPdfMaxGridWidth: 500,
        // exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        showGridFooter: true,
        gridFooterTemplate: "<div class=\"ui-grid-footer-info ui-grid-grid-footer\"><span>Total {{grid.rows.length}}</span></div>"
    }


    // Default values
    $scope.level_from=75;
    $scope.level_to=100;
    $scope.max_distance=10000;
    $scope.datepicker_from=moment().subtract(3, "hours");//.format("DD-MM-YYYY");
    $scope.datepicker_to=moment();
    $scope.track_number=22472;

    $scope.fill_table = function() {
      $scope.datepicker_to_timestamp=moment($scope.datepicker_to).format("X");
      $scope.datepicker_from_timestamp=moment($scope.datepicker_from).format("X");
      // console.log('FROM', $scope.datepicker_from)
      // console.log('FROM TIMESTAMP', $scope.datepicker_from_timestamp)
      // console.log('LEVEL FROM', $scope.level_from)
      // console.log('LEVEL TO', $scope.level_to)
      // console.log('MAX DIST', $scope.max_distance)
      

        if ($scope.unique_noise) {
          // console.log('unique')
          $http.get('http://localhost:3000/noise_data/unique/'+$scope.level_from+'/'+$scope.level_to+'/'+$scope.max_distance+'/'+$scope.datepicker_from_timestamp+'/'+$scope.datepicker_to_timestamp).then(function (data) {   
            $scope.gridOptions=data.data;
          });
        } else {
          // console.log('not unique')
          $http.get('http://localhost:3000/noise_data/'+$scope.level_from+'/'+$scope.level_to+'/'+$scope.max_distance+'/'+$scope.datepicker_from_timestamp+'/'+$scope.datepicker_to_timestamp).then(function (data) {   
            $scope.gridOptions=data.data;
        });
        }








    }

    $scope.fill_noise_table_by_track = function() {
        $http.get('http://localhost:3000/noise_data/'+$scope.track_number).then(function (data) {   
          $scope.gridOptions=data.data;
        });

        $http.get('http://localhost:3000/noise_data/chart/'+$scope.track_number).then(function (result) {
            $scope.Noise_Chart = result;
            $scope.chartConfig.series=[{
            data: $scope.Noise_Chart.data,
            id: 'Level'
          }]
        });


    }




    // CHARTS




Highcharts.setOptions({
            lang: {
                loading: 'Загрузка...',
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
                exportButtonTitle: "Экспорт",
                printButtonTitle: "Печать",
                rangeSelectorFrom: "С",
                rangeSelectorTo: "По",
                rangeSelectorZoom: "Период",
                downloadPNG: 'Скачать PNG',
                downloadJPEG: 'Скачать JPEG',
                downloadPDF: 'Скачать PDF',
                downloadSVG: 'Скачать SVG',
                printChart: 'Напечатать график'
            }
    });



    $scope.chartConfig = {
        chartType: 'stock',
        chart: {
            type: 'areaspline',
            threshold: null,
            tooltip: {
              valueDecimals: 2
            }
          // events: {
          //   // load: function () {
          //   // // set up the updating of the chart each second
          //   //   // var series = this.series[0]; // 
          //   //   // static update each 10s


          //   // }
          // }
        },

        navigator: {
            enabled: true
        },
        rangeSelector: {
          buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 3,
            type: 'minute',
            text: '3M'
        }, {
          count:5,
            type: 'minute',
            text: '5M'
        }],
          inputEnabled: false
          // selected: 0
        },
        title: {
            text: 'Станция шума'
        },
        credits:{"enabled":false},
        legend: {
          enabled: true,
          align: 'right',
          // backgroundColor: '#FCFFC5',
          borderColor: 'white',
          borderWidth: 0,
          layout: 'vertical',
          verticalAlign: 'top',
          y: 100,
          // shadow: true
        },
        series: [{
          fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          data: [[]],
          name: 'Уровень шума',
          id: 'Level',
        }]
    }
}).





// TRACKS TAB
controller('TracksController',function($scope,$state,$stateParams,$interval,$http,$filter,uiGridConstants){
    $scope.gridOptions = {
         data: {}, 
         // enableVerticalScrollbar: 1,
         enableFiltering: true,
         columnDefs: [
         { field: 'time_track', displayName: 'Время',type: 'date',cellFilter: 'date:\'yyyy-MM-dd H:mm:ss\'', width: '12%', enableFiltering: true, 
          sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }},
         { field: 'track', displayName: 'Трек', width: '4%'},
         { field: 'icao', displayName: 'ICAO', width: '4%'},
         { field: 'type', displayName: 'Самолет', width: '10%'},
         { field: 'operator', displayName: 'Авиакомпания', width: '10%'},
         { field: 'callsign', displayName: 'Позывной', width: '4%'},
         { field: 'fromairport', displayName: 'Откуда', width: '6%'},
         { field: 'toairport', displayName: 'Куда', width: '6%'},
         { field: 'altitude', displayName: 'Высота', width: '4%', enableFiltering: false},
         { field: 'speed', displayName: 'Скорость', width: '4%', enableFiltering: false},
         { field: 'angle', displayName: 'Курс', width: '3%', enableFiltering: false},
         { field: 'longitude', displayName: 'Долгота', width: '5%', enableFiltering: false},
         { field: 'latitude', displayName: 'Широта', width: '5%', enableFiltering: false},
         { field: 'vertical_speed', displayName: 'Верт. скорость', width: '6%', enableFiltering: false},
         { field: 'distance_1', displayName: 'Расстояние', width: '6%', enableFiltering: false},
         ],

        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv',
        showGridFooter: true,
        gridFooterTemplate: "<div class=\"ui-grid-footer-info ui-grid-grid-footer\"><span>Total {{grid.rows.length}}</span></div>"
    }

    $scope.datepicker_from=moment().subtract(1, "hours");//.format("DD-MM-YYYY");
    $scope.datepicker_to=moment();

    $scope.fill_tracks_table = function() {
        $scope.datepicker_to_timestamp=moment($scope.datepicker_to).format("X");
        $scope.datepicker_from_timestamp=moment($scope.datepicker_from).format("X");
        console.log('FILL TRACK TABLE')
        $http.get('http://localhost:3000/tracks/'+$scope.datepicker_from_timestamp+'/'+$scope.datepicker_to_timestamp).then(function (data) {
          $scope.gridOptions=data.data;
        });
    }
    

    $scope.track=1488; // default value
    $scope.fill_tracks_table_by_track_number = function() {
        // console.log('FILL TRACK TABLE')
        $http.get('http://localhost:3000/tracks/'+$scope.track).then(function (data) {
          $scope.gridOptions=data.data;
        });
    }


}).











// STAT TAB
controller('StatsController',function($scope,$http,$timeout){
$http.get('http://localhost:3000/Flight_stats').then(function (result) {
      $scope.exportData = result;
});



Highcharts.setOptions({
            lang: {
                loading: 'Загрузка...',
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
                exportButtonTitle: "Экспорт",
                printButtonTitle: "Печать",
                rangeSelectorFrom: "С",
                rangeSelectorTo: "По",
                rangeSelectorZoom: "Период",
                downloadPNG: 'Скачать PNG',
                downloadJPEG: 'Скачать JPEG',
                downloadPDF: 'Скачать PDF',
                downloadSVG: 'Скачать SVG',
                printChart: 'Напечатать график'
            }
    });



    $scope.chartConfig = {
    chartType: 'stock',
        chart: {
            type: 'column',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            }
          },
    navigator: {
        enabled: true
    },
    credits:{"enabled":false},
    rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'month',
                count: 3,
                text: 'День',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'year',
                count: 1,
                text: 'Неделя',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                }
            }, {
                type: 'all',
                text: 'Месяц',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }, {
                type: 'all',
                text: 'Год',
                dataGrouping: {
                    forced: true,
                    units: [['year', [1]]]
                }
            }],
            buttonTheme: {
                width: 60
            },
            selected: 2
        },
        title: {
            text: 'Колличество зарегистрированных ВС'
        },
      series: [{
                fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
        data: [[]],
        id: 'Flights',
        name: 'ВС',
      }]
      };



    $scope.chartConfig2 = {
        chartType: 'stock',
        chart: {
          type: 'column',
          threshold: null,
          tooltip: {
              valueDecimals: 2
          }
        },
        navigator: {
            enabled: true
        },
        credits:{"enabled":false},
        rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                    type: 'month',
                    count: 3,
                    text: 'День',
                    dataGrouping: {
                        forced: true,
                        units: [['day', [1]]]
                    }
                }, {
                    type: 'year',
                    count: 1,
                    text: 'Неделя',
                    dataGrouping: {
                        forced: true,
                        units: [['week', [1]]]
                    }
                }, {
                    type: 'all',
                    text: 'Месяц',
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]]
                    }
                }, {
                    type: 'all',
                    text: 'Год',
                    dataGrouping: {
                        forced: true,
                        units: [['year', [1]]]
                    }
                }],
                buttonTheme: {
                    width: 60
                },
                selected: 2
            },
            title: {
                text: 'Колличество нарушений'
            },
        series: [{
                    fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
            data: [[]],
            id: 'Flights',
            name: 'Самолеты',
        }]
      };



// default Value
$scope.restrict_noise_level=69;
$http.get('http://localhost:3000/Flight_stats').then(function (result) {
      $scope.chartConfig.series=[{
        data: result.data,
        id: 'Flights',
        name: 'Flights'
      }]

});

$http.get('http://localhost:3000/Noise_stats/'+$scope.restrict_noise_level).then(function (result) {
        $scope.chartConfig2.series=[{
        data: result.data,
        id: 'Flights',
        name: 'Flights'
      }];
      $scope.chartConfig.rangeSelector.selected=0;
      $scope.chartConfig2.rangeSelector.selected=0;

});


$scope.$watch('restrict_noise_level', function() {
  $http.get('http://localhost:3000/Noise_stats/'+$scope.restrict_noise_level).then(function (result) {
          $scope.chartConfig2.series=[{
          data: result.data,
          id: 'Flights',
          name: 'Flights'
        }]

  });
});



});
