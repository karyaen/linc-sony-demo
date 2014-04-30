'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var nOpen = require('open');
var livereload = require('gulp-livereload');
var openPath;
var openBrowser;
var env;

/*
 * Set up the app mode based on either the NODE_ENV
 * env var or the --prod command line parameter. Default
 * to 'development' if neither is set.
 */
if (process.env.NODE_ENV) {
  env = process.env.NODE_ENV;
} else if (gutil.env.hasOwnProperty('prod')) {
  env = 'prod';
} else {
  env = 'development';
}
process.env.NODE_ENV = env;

/*
 * Allow for a custom URL path to be set
 * when starting the app in development mode.
 * This will be appended to the URL that is opened.
 *
 * Example: gulp --open=admin
 */
openPath = gutil.env.open || '';

/*
 * Allow for a different browser to be used
 * when opening the app in development mode.
 * By default use the user's default browser;
 *
 * Example: gulp --browser=Firefox
 */
openBrowser = gutil.env.browser;

/*
 * Default task is to start the app
 */
gulp.task('default', ['app']);

gulp.task('app', function () {
  var express = require('express');
  var checkMobile = require('connect-mobile-detection');
  var app = express();

  /*
   * Sets properties on the req object based on
   * the user agent.
   *
   * https://github.com/sprice/connect-mobile-detection
   */
  app.use(checkMobile());

  /*
   * When in development mode start a livereload server
   */
  if (process.env.NODE_ENV === 'development') {
    app.use(require('connect-livereload')({
      port: 35729
    }));
  }

  /*
   * Static asset hosting paths
   */
  app.use(express.static('assets'));
  app.use(express.static('assets/store.sony.com'));
  app.use(express.static('assets/m'));
  app.use(express.static('assets/m/m.store.sony.com'));

  /*
   * The root path hosts the static sony demo product page
   * Server side adaptive response is setup to use a mobile
   * formatted page for mobile devices.
   */
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
    /*
     * When in development mode listen for file changes to
     * trigger the livereload server. Also, opens a browser after
     * the express server is connected.
     */
    if (process.env.NODE_ENV === 'development') {
      var lrServer = livereload();

      gulp.watch('assets/admin/**/*.*').on('change', function (file) {
        console.log('Reload', file.path);
        lrServer.changed(file.path);
      });

      nOpen('http://localhost:3000/' + openPath, openBrowser);
    }
  });
});
