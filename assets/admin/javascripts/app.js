'use strict';

function generatePoints( count, start, end, randomness ) {
  var points = [];
  var slope = ( end - start ) / count;
  for( var i = 0; i < count; i++ ) {
    var pt = start + ( slope * i );
    pt += ( Math.random() * ( randomness * 2 ) ) - randomness;
    if ( pt < 0 ) pt = 0;
    points.push( Math.round( pt ) );
  }
  return points;
}

function buildWave( data, key, start, randomness, points ) {
  var current = start;
  var ind = 0;
  for( var i in points ) {
    var out = generatePoints( points[i][0], start, start + points[i][1], randomness );
    for( var o in out ) {
      data[ ind++ ][ key ] = out[ o ];
    }
    start += points[i][1];
  }
}

angular.module('lwaAdminApp', [
  'ngRoute',
  'highcharts-ng',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ngAnimate'
])
  .directive('activity',function(){
    return {
      restrict: 'E',
      templateUrl: 'directives/activity.html',
      scope: {
        icon: '@icon',
        first: '@first',
        last: '@last',
        name: '@name',
        since: '@since',
        replies: '@replies',
        plusk: '@plusk',
        posted: '@posted',
        topreply: '@topreply'
      },
      transclude: true,
      link: function( $scope, element ) {
        $scope.sendPerk = function() {
          $scope.$emit('sendPerk',null);
        }
        var transcludedBlock = element.find('div.transcluded');
        var postBlock = element.find('div.post-holder');
        var responseBlock = element.find('div.response-holder');
        angular.forEach( transcludedBlock.children(), function(elem) {
            if (angular.element(elem).hasClass('post')) {
              postBlock.append( elem );
            } else if (angular.element(elem).hasClass('response')) {
              responseBlock.append( elem );
            }
        });
        transcludedBlock.remove();
      }
    }
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/wants', {
        templateUrl: 'views/demand.html',
        controller: 'DemandCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.controller('TopCtrl', function ( $scope, $location, $modal ) {
  $scope.set_range = function( range ) {
    $scope.range = range;
  }
  $scope.range = 90;

  $scope.tab = 'overview';
  $scope.$on('tabChange',function(event,tab){
    $scope.tab = tab;
    $scope.setup_chart();
  });

  $scope.chart = 'price_histogram';
  $scope.set_chart = function( chart ) {
    $scope.chart = chart;
  }

  $scope.payHistogramConfig = {
    series: [{
      type: 'column',
      name: 'Price',
      color: '#6666cc',
      data: []
    }],
    xAxis: {
      categories: []
    },
    chart: {
      renderTo: 'payHistogram',
      type: 'column',
      zoomType: 'x',
      events: {
        selectionDuring: function(event) {
          var min = Math.round(event.min);
          var max = Math.round(event.max);
          $scope.payHistogramConfig.series[0].data[min].color = 'orange';
        },
        selection: function(event) {
          if (event.xAxis) {
            $scope.histogramClick(Math.round(event.xAxis[0].min),Math.round(event.xAxis[0].max));
            return false;
          }
        }
      },
      selectionMarkerFill: 'rgba(0,255,0,0.50)'
    },
    yAxis: {
      title: {
        text: 'Count'
      }
    },
    title: { text: '' }
  };

  $scope.payChartConfig = {
    series: [{
            type: 'areaspline',
            name: 'Mean price',
            pointInterval: 24 * 3600 * 1000,
            pointStart: 0,
            data: [],
            marker: {
              enabled: false
            }
        }],
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 5,
                marker: {
                    enabled: false,
                    symbol: null
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 14 * 24 * 3600000, // fourteen days
            title: {
                text: null
            }
        },
        legend: {
            enabled: false
        },
        chart: {
            zoomType: 'x',
            spacingRight: 20
        },
        yAxis: {
          min: 15,
            title: {
                text: 'Price'
            }
        },
        title: { text: '' },
    loading: false,
    useHighStocks: false
  };

  $scope.activityChartConfig = {
    series: [{
            type: 'areaspline',
            name: 'Number of users',
            pointInterval: 24 * 3600 * 1000,
            pointStart: 0,
            data: [],
            color: '#6666cc',
            marker: {
              enabled: false
            }
      }],
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 14 * 24 * 3600000, // fourteen days
            title: {
                text: null
            }
        },
        legend: {
            enabled: false
        },
        chart: {
        },
        yAxis: {
            title: {
                text: 'Users'
            }
        },
        title: { text: '' },
    loading: false,
    useHighStocks: false
  };

  $scope.last30 = {
    wants: 0,
    stars: {
      1: 10,
      2: 3,
      3: 27,
      4: 62,
      5: 210
    },
    total_stars: 0,
    qa_total_questions: 32,
    qa_total: 27,
    qa_solved: 24,
    qa_solved_pct: 0
  }
  $scope.last30.total_stars = $scope.last30.stars[1] + $scope.last30.stars[2] + $scope.last30.stars[3] + $scope.last30.stars[4] + $scope.last30.stars[5];
  $scope.last30.qa_solved_pct = Math.round( ( parseFloat( $scope.last30.qa_solved ) / parseFloat( $scope.last30.qa_total ) ) * 100.0 );

  $scope.data = [];
  $scope.setup_chart = function() {
    if ( $scope.data.length == 0 ) return;

      var avg_pay = [];
      var totals = [];
      var start = $scope.data.length - $scope.range;
      var first = $scope.data[0];

      var average_pay = 0.0;
      var average_users = 0.0;

      $scope.last30.wants = 0;
      for( var i = $scope.data.length - 30; i < $scope.data.length; i++ ) {
        $scope.last30.wants += $scope.data[i].total;
      }

      for( var i = start; i < $scope.data.length; i++ ) {
        var pay = Math.round( $scope.data[i].mean * 100.0 ) / 100.0;
        avg_pay.push( pay );
        average_pay += pay;

        totals.push( $scope.data[i].total );
        average_users += $scope.data[i].total;
      }

      var bucket_size = 100.0;

      var min_pay = 10000;
      var max_pay = 0;
      for( var i = start; i < $scope.data.length; i++ ) {
        var pay = Math.round( $scope.data[i].mean * 100.0 ) / 100.0;
        if ( pay < min_pay ) min_pay = pay;
        if ( pay > max_pay ) max_pay = pay;
      }
      min_pay = Math.floor( min_pay / bucket_size ) * bucket_size;
      min_pay = 2000;
      max_pay = Math.floor( max_pay / bucket_size ) * bucket_size;
      var bucket_count = ( max_pay - min_pay ) / bucket_size;
      var buckets = [];
      $scope.bucket_numbers = [];
      $scope.bucket_sizes = {};
      for( var b = 0; b < bucket_count; b++ ) {
        buckets.push( 0 );
        var buck = Math.round( min_pay + ( b * bucket_size ) );
        $scope.bucket_numbers.push( buck );
        $scope.bucket_sizes[ buck ] = 0;
      }
      for( var i = start; i < $scope.data.length; i++ ) {
        var pay = Math.round( $scope.data[i].mean * 100.0 ) / 100.0;
        var adj = Math.floor( pay / bucket_size ) * bucket_size;
        var b = Math.floor( ( adj - min_pay ) / bucket_size );

        $scope.bucket_sizes[ adj ] += 1;

        buckets[ b ] += 1;
      }
      buckets.splice( buckets.length - 3, 3 );
//      $scope.bucket_numbers.splice( $scope.bucket_numbers.length - 2, 2 );

      var new_buckets = [];
      for( var b in buckets ) {
        new_buckets.push({ y: buckets[b], color: '#6666cc' });
      }

      $scope.payHistogramConfig.series[0].data = new_buckets;

      $scope.payHistogramConfig.xAxis.categories = $scope.bucket_numbers;

      if( $('#payHistogram').length > 0 ) {
        new Highcharts.Chart($scope.payHistogramConfig);
      }

      if( avg_pay.length > 60 ) {
        avg_pay[ 15 ] = { marker: {
                    fillColor: '#FF0000',
                    lineWidth: 5,
                    lineColor: "#FF0000",
                    symbol: 'triangle',
                    enabled: true
            }, y:avg_pay[ 15 ] }
        totals[ 15 ] = { marker: {
                    fillColor: '#FF0000',
                    lineWidth: 5,
                    lineColor: "#FF0000",
                    symbol: 'triangle',
                    enabled: true
            }, y:totals[ 15 ] }
      }

      $scope.average_pay = average_pay / $scope.range;
      $scope.average_users = average_users / $scope.range;

      $scope.payChartConfig.series[0].pointStart = first.timestamp;
      $scope.payChartConfig.series[0].data = avg_pay;

      $scope.activityChartConfig.series[0].pointStart = first.timestamp;
      $scope.activityChartConfig.series[0].data = totals;
  }

  $scope.next_user_id = 1;

  $scope.usersToAdd = [];
  $scope.addUserToUsers = function() {
    $scope.$apply( function() {
      $scope.users.push( $scope.usersToAdd.shift() );
    } );
    if ( $scope.usersToAdd.length > 0 ) {
      window.setTimeout( $scope.addUserToUsers, 50 );
    }
  }

  $scope.price_low = 2000;
  $scope.price_high = 3000;
  $scope.user_count = 120;
  $scope.histogramClick = function( low, high ) {
    $scope.usersToAdd = [];
    $scope.users = [];

    var min = $scope.bucket_numbers[ low ];
    var max = $scope.bucket_numbers[ high ];
    $scope.price_low = min;
    $scope.price_high = max;
    for( var u = 0; u < 20; u++ ) {
      var value = ( Math.random() * ( max - min ) ) + min;
      value = Math.floor( value / 100.0 ) * 100.0;
      $scope.usersToAdd.push( {
        selected: false,
        id: $scope.next_user_id++,
        name: chance.name(),
        email: chance.email(),
        klout: Math.round( 50 + ( ( Math.random() * 10 ) - 5 ) ),
        price: value
      })
    }
    $scope.updateSorting();
    $scope.addUserToUsers();
  }

  $scope.data = [];
  for( var i = 0; i < 90; i++ ) {
    $scope.data.push( {} );
  }
  var mag = 4;
  buildWave( $scope.data, 'mean', 2000, 80, [
    [ 10, 0 * mag ],
    [ 10, 100 * mag ],
    [ 10, 200 * mag ],
    [ 10, -25 * mag ],
    [ 10, -50 * mag ],
    [ 10, -25 * mag ],
    [ 10, -15 * mag ],
    [ 10, -10 * mag ],
    [ 10, -5 * mag ]
  ]);
  buildWave( $scope.data, 'total', 100, 30, [
    [ 10, 0 * mag ],
    [ 10, 10 * mag ],
    [ 10, 20 * mag ],
    [ 10, -5 * mag ],
    [ 10, -10 * mag ],
    [ 10, -5 * mag ],
    [ 10, -5 * mag ],
    [ 10, 0 * mag ],
    [ 10, 0 * mag ]
  ]);

  $scope.sort_order = 'name';
  $scope.sort_reverse = false;
  $scope.sort = function( column ) {
    if ( $scope.sort_order === column ) {
      $scope.sort_reverse = !$scope.sort_reverse;
    }
    $scope.sort_order = column;
    $scope.updateSorting();
  }
  $scope.updateSorting = function() {
    if ( $scope.sort_order == 'name' ) {
      $scope.users = _.sortBy($scope.users,'name');
      $scope.usersToAdd = _.sortBy($scope.usersToAdd,'name');
    }
    if ( $scope.sort_order == 'score' ) {
      $scope.users = _.sortBy($scope.users,'klout');
      $scope.usersToAdd = _.sortBy($scope.usersToAdd,'klout');
    }
    if ( $scope.sort_order == 'pay' ) {
      $scope.users = _.sortBy($scope.users,'price');
      $scope.usersToAdd = _.sortBy($scope.usersToAdd,'price');
    }
    if ( $scope.sort_order == 'email' ) {
      $scope.users = _.sortBy($scope.users,'email');
      $scope.usersToAdd = _.sortBy($scope.usersToAdd,'email');
    }
    if ( $scope.sort_reverse ) {
      $scope.users = $scope.users.reverse();
      $scope.usersToAdd = $scope.usersToAdd.reverse();
    }
  }

  $scope.users = [];
  for( var u = 0; u < 20; u++ ) {
    var price = 3200 + ( ( Math.random() * 400 ) - 200 );
    price = Math.round( price / 100.0 ) * 100.0;
    $scope.users.push( {
      selected: false,
      id: $scope.next_user_id++,
      name: chance.name(),
      email: chance.email(),
      klout: Math.round( 50 + ( ( Math.random() * 10 ) - 5 ) ),
      price: Math.round( price )
    });
    $scope.updateSorting();
  }

  $scope.$watch( 'range', function() { $scope.setup_chart(); } );
  $scope.$watch( 'data', function() { $scope.setup_chart(); } );

  $scope.chartClick = function() {
    document.location.href = '/admin/#/wants';
  };

  $scope.$on( 'sendPerk', function( ) {
    console.log( 'sendPerk' );
    $scope.open( { name: 'Peter Parker', klout: 49 } );
  } );

  $scope.open = function( user ) {
    $scope.user = user;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        user: function () {
          return $scope.user;
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
    });
  };
});


var OfferInstanceCtrl = function ($scope, $modalInstance, data) {
  $scope.low = data.low;
  $scope.high = data.high;
  $scope.count = data.count;
  $scope.discount = data.discount;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

var ModalInstanceCtrl = function ($scope, $modalInstance, user) {
  $scope.user = user;
  $scope.perksMode = false;
  $scope.doneMode = false;

  $scope.doDone = function() {
    $scope.doneMode = true;
  }

  $scope.sendPerk = function() {
    $scope.perksMode = true;
  }

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};