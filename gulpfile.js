var
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlmin = require('gulp-htmlmin'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('gulp-cssnano'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  babel = require("gulp-babel"),
  del = require('del'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),

  // folders
  reload = browserSync.reload,
  folder = {
    src: 'app/',
    build: 'dist/'
  };

// image processing
gulp.task('images', function () {
  var out = folder.build + 'images/';
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});


gulp.task('html', ['images'], function () {
  var
    out = folder.build;
  return gulp.src(folder.src + '**/*.html')
    // .pipe(newer(out))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      // collapseBooleanAttributes: true,
      // removeAttributeQuotes: true,
      // removeRedundantAttributes: true,
      // removeEmptyAttributes: true,
      // removeScriptTypeAttributes: true,
      // removeStyleLinkTypeAttributes: true,
      // removeOptionalTags: true
    }))
    .pipe(gulp.dest(out));
});

gulp.task('css', ['sass'], function () {
  var
    out = folder.build + 'css/',
    plugins = [autoprefixer];

  return gulp.src(folder.src + 'css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(out));
});

gulp.task('sass', function () {
  var
    out = folder.src + 'css/';
  return gulp.src(folder.src + 'scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(out))
});

// JavaScript processing
gulp.task('js', function () {
  var
    out = folder.build + 'js/';
  return gulp.src(folder.src + 'js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(stripdebug())
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(out));

  // return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});

gulp.task('serve', ['js', 'css'], function () {
  // var
  //   src = folder.src;
  browserSync.init({
    server: './app',
    port: 3000
  });

  gulp.watch([folder.src + '**/*.html'], reload);
  gulp.watch([folder.src + 'css/**/*.css'], ['css', reload]);
  gulp.watch([folder.src + 'scss/**/*.scss'], ['css'], reload);
  gulp.watch([folder.src + 'js/**/*.js'], ['js'], reload);
  gulp.watch([folder.src + 'images/**/*'], reload);

});

gulp.task('serve:dist', ['js', 'css', 'html'], function () {
  // var
  //   src = folder.src;
  browserSync.init({
    server: './dist',
    port: 3000
  });

  gulp.watch([folder.src + '**/*.html'], reload);
  gulp.watch([folder.src + 'css/**/*.css'], ['css', reload]);
  gulp.watch([folder.src + 'scss/**/*.scss'], ['css'], reload);
  gulp.watch([folder.src + 'js/**/*.js'], ['js'], reload);
  gulp.watch([folder.src + 'images/**/*'], reload);

});

gulp.task('clean', function () {
  var
    out = folder.build;
  return del([out + '*'], { dot: true });
});
