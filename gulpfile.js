'use strict';

var gulp = require('gulp');
var nOpen = require('open');

gulp.task('default', ['app']);

gulp.task('app', function () {
  var express = require('express');
  var checkMobile = require('connect-mobile-detection');
  var app = express();

  app.use(checkMobile());

  app.use(express.static(__dirname + '/assets'));
  app.use(express.static(__dirname + '/assets/store.sony.com'));
  app.use(express.static(__dirname + '/assets/m'));
  app.use(express.static(__dirname + '/assets/m/m.store.sony.com'));

  app.get('/', function (req, res) {
    var file;

    if (req.mobile) {
      file = 'assets/m/m.store.sony.com/products/27-XBR55X900A.html';
    } else {
      file = 'assets/store.sony.com/55-class-54.6-diag-xbr-4k-ultra-hd-tv-zid27-XBR55X900A/cat-27-catid-Sony-HD-TVs.html';
    }
    res.sendfile(file);
  });

  app.listen(3000, function () {
    nOpen('http://localhost:3000');
  });
});
