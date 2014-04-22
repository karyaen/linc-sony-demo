'use strict';

var gulp = require('gulp');
var nOpen = require('open');

gulp.task('default', ['app']);

gulp.task('app', function () {
  var connect = require('connect');
  var http = require('http');

  var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('assets'))
    .use(connect.static('assets/store.sony.com'))
    .use(connect.static(
    'assets/store.sony.com/55-class-54.6-diag-xbr-4k-ultra-hd-tv-zid27-XBR55X900A', {
      index: 'cat-27-catid-Sony-HD-TVs.html'
    }));

  http.createServer(app).listen(3000, function () {
    nOpen('http://localhost:3000');
  });
});
