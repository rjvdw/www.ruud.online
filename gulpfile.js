'use strict'

const gulp = require('gulp')
const shell = require('gulp-shell')
const BrowserSync = require('browser-sync')

const browserSync = BrowserSync.create()

gulp.task('jekyll', shell.task(['bundle exec jekyll serve']))

gulp.task('browser-sync', () => {
  browserSync.init({
    server: { baseDir: '_site/' },
  })

  gulp.watch('_site/**/*.*')
    .on('change', browserSync.reload)
})

gulp.task('default', ['jekyll', 'browser-sync'])
