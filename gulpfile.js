'use strict';

// --------------------------
// Require
var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var sprite      = require('gulp.spritesmith');
var iconfont    = require('gulp-iconfont');
var rename      = require('gulp-rename');
var consolidate = require('gulp-consolidate');

// --------------------------
// Functions
var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};

// --------------------------
// Web Font Icon Create
gulp.task('iconfont', function() {
  var folders = getFolders('./develop/font/');
  folders.forEach(function(folder){
    gulp.src('./develop/font/' + folder + '/*.svg')
      .pipe(iconfont({
        fontName: folder,
        prependUnicode: true,
        startUnicode: 0xF001,
        formats: ['ttf', 'eot', 'woff'],
        normalize: true,
        fontHeight: 500
      }))
      .on('glyphs', function(glyphs, options) {
        var opt = {
          glyphs: glyphs.map(function(glyph) {
            return {
              name: glyph.name,
              codepoint: glyph.unicode[0].charCodeAt(0)
            };
          }),
          fontName: folder,
          fontPath: './font/',
          className: 'ico'
        };
        // Web Font CSS Sample Create
        gulp.src('./develop/template/iconfont-sample.css')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('./public/webfont'));
        // Web Font HTML Sample Create
        gulp.src('./develop/template/iconfont-sample.html')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('./public/webfont'));
      })
      .pipe(gulp.dest('./public/webfont/font'));
  });
});

// --------------------------
// CSS Sprite Create
gulp.task('sprite', function() {
  var folders = getFolders('./develop/img-sprite/');
  folders.forEach(function(folder){
    var spriteData = gulp.src('./develop/img-sprite/' + folder + '/*.png')
      .pipe(sprite({
        imgName: 'sprites_' + folder + '.png',
        imgPath: 'img/sprites_' + folder + '.png',
        cssName: folder + '.css',
        retinaSrcFilter: './develop/img-sprite/' + folder + '/*@2x.png',
        retinaImgName: 'sprites_' + folder + '@2x.png',
        retinaImgPath: 'img/sprites_' + folder + '@2x.png',
        padding: 4,
        cssTemplate: function(data) {
          var opt = {
            spriteName: folder,
            className: 'ico',
            data: data
          };
          // Sprite HTML Sample Create
          gulp.src('./develop/template/sprite-sample.html')
            .pipe(consolidate('lodash', opt))
            .pipe(rename({
              basename: folder
            }))
            .pipe(gulp.dest('./public/sprites'));
          // Sprite CSS Sample Create
          gulp.src('./develop/template/sprite-sample.css')
            .pipe(consolidate('lodash', opt))
            .pipe(rename({
              basename: folder
            }))
            .pipe(gulp.dest('./public/sprites'));
          return '';
        }
      }));
    spriteData.img
      .pipe(gulp.dest('./public/sprites/img'));
  })
});