//**********************************
// production build script
// - depend on dev tasks
//**********************************
'use strict';

var conf = require('./conf');
var util = require('./util');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');  //TODO remove
var purify = require('gulp-purifycss');
var vinylPaths = require('vinyl-paths');
var gulpIf = require('gulp-if');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var _ = require('lodash');
var intercept = require('gulp-intercept');
// var lineReader = require('line-reader');
var replace = require('gulp-replace-pro');
var qiniu = require('gulp-qiniu-upload');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var revision = '_v' + conf.pkg.version;

/**
 * Compile angular patials to template cache
 */
gulp.task('build:partials', function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: conf.module,   //TODO move in one place
            root: 'app'  //TODO check
        }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/partials')));
});

/**
 * Inject templateCache to index.html
 */
gulp.task('inject:partials', ['build:partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };
    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

/**
 * Build html (inject, minify)
 */
//TODO improve code using https://github.com/OverZealous/lazypipe
//TODO improve performance using gzip https://github.com/jstuckey/gulp-gzip
gulp.task('build:html', ['inject:jscss', 'inject:partials'], function () {
    var htmlFilter = $.filter('*.html', { restore: true });
    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });

    //https://github.com/jstuckey/gulp-gzip
    var gzipConfg = {
        //minimum size required to compress a file
        threshold: '1kb',
        //appends .gz file extension if true. Defaults to true.
        append: true,
        // options object to pass through to zlib.Gzip.
        gzipOptions: {
            // compression level between 0 and 9
            // 1 gives best speed, 9 gives best compression, 0 gives no compression at all
            level: 9,

            // specifies how much memory should be allocated for the internal compression state
            // memLevel=1 uses minimum memory but is slow and reduces compression ratio;
            // memLevel=9 uses maximum memory for optimal speed.
            memLevel: 8
        }
    };

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.useref({}, lazypipe().pipe($.sourcemaps.init, { loadMaps: false })))//此参数设置为false可以减少包的体积,不知会否对其它有什么影响
        .pipe(gulpIf('!*.html', $.rev()))
        //js
        .pipe(jsFilter)
        .pipe($.ngAnnotate({
            //ref:
            //https://github.com/olov/ng-annotate/issues/134
            //https://github.com/Kagami/gulp-ng-annotate/issues/26
            gulpWarnings: false //typescript removes base path for some reason.  Warnings result that we don't want to see.
        }))
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
        .pipe(jsFilter.restore)
        //css
        .pipe(cssFilter)
        .pipe($.replace('../../bower_components/bootstrap/fonts/', '../fonts/'))
        .pipe($.replace('../../bower_components/font-awesome/fonts/', '../fonts/'))
        .pipe($.replace('../../bower_components/simple-line-icons/fonts/', '../fonts/'))
        //https://github.com/purifycss/purifycss/pull/62
        // .pipe(
        //     purify([
        //         path.join(conf.paths.src, '/app/**/*.html'),
        //         path.join(conf.paths.tmp, '/serve/app/**/*.html')
        //     ])
        //     )
        //https://github.com/giakki/uncss/issues/49
        //http://warambil.com/blog/2014/04/26/removing-unused-css/
        // .pipe($.uncss({
        //     ignore: ['.browsehappy'],
        //     html: [
        //         path.join(conf.paths.src, '/app/**/*.html'),
        //         path.join(conf.paths.tmp, '/serve/app/**/*.html')
        //     ]
        // }))
        .pipe($.minifyCss({ processImport: false }))
        .pipe(cssFilter.restore)
        .pipe($.sourcemaps.write('maps'))
        .pipe($.revReplace())//.pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css', '.html', '.hbs', '.styl']}))
        // html

        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        // self-rev-replace
        /*
         .pipe($.replace(/(styles|scripts)\/([^\.]+\.(css|js))/g, function (match, dir, filename, extname) {
         // rename file BUT also need rename the real file in styles & script dir
         //dir: styles|scripts
         //filename:  xxx.js | xxx.css
         //extname:  css |  js
         var resourceDir = path.join(__dirname, '..', conf.paths.build, dir);
         var filebasename = path.basename(filename, '.' + extname);
         var revFilename = filebasename + revision + '.' + extname;
         //console.log(path.join(dir, revFilename));
         return path.join(dir, revFilename);
         })).on('error', conf.errorHandler('Revision'))
         */
        .pipe(htmlFilter.restore)
        //--> Enable gzip when production
        //        .pipe(gulpIf('!*.html', $.gzip(gzipConfg)))
        .pipe(gulp.dest(path.join(conf.paths.build, '/')))
        .pipe($.size({ title: path.join(conf.paths.build, '/'), showFiles: true }));
});

/**
 * Build fonts (mainly copy to the target build folder)
 */
gulp.task('build:fonts', function () {
    return gulp.src($.mainBowerFiles()
        .concat([path.join(conf.paths.src, '/assets/fonts/**/*'), 'bower_components/**/*']))
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2,otf}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.build, '/fonts/')));
});

/**
 * Build images (minify and copy to the target build folder)
 */
gulp.task('build:images', function () {
    return gulp.src([
        path.join(conf.paths.src, '/assets/images/*.{png,jpg,gif,ico,svg}')
    ])
        .pipe($.imagemin({
            optimizationLevel: 5, //type：Number  defaults：3,  optimization level between [0 - 7 ]
            progressive: true, //type：Boolean defaults：false, Lossless conversion to progressive(jpg)
            interlaced: true, //type：Boolean defaults：false, Interlace gif for progressive rendering(gif)
            multipass: true //type：Boolean defaults：false, Optimize svg multiple times until it's fully optimized(svg)
        }))
        .pipe(gulp.dest(path.join(conf.paths.build, '/images')));
});
/**
 * Build locales (minify and copy to the target build folder)
 */
gulp.task('build:js_components', function () {
    return gulp.src([
        path.join(conf.paths.src, '/assets/js_components/**/*')
    ]).pipe(gulp.dest(path.join(conf.paths.build, '/js_components')));
});
/**
 * Build locales (minify and copy to the target build folder)
 */
gulp.task('build:locales', function () {
    return gulp.src([
        path.join(conf.paths.src, '/assets/locales/*.json')
    ])
        .pipe($.jsonminify())
        .pipe(gulp.dest(path.join(conf.paths.build, '/locales')));
});


/**
 * Clean all the previously build result
 */
gulp.task('build:clean', function () {
    util.rmdirp(path.join(conf.paths.build, '/'));
    util.rmdirp(path.join(conf.paths.tmp, '/'))

    // del failed to work if the dir is not empty
    //return $.del.sync([path.join(conf.paths.build, '/'), path.join(conf.paths.tmp, '/')]);
})

/**
 * Rename css and js files
 */
gulp.task('build:rev', ['build:clean', 'build:html', 'build:fonts', 'build:images', 'build:locales','build:js_components'], function () {
    return new Promise(function (resolve, reject) {
        var vp = vinylPaths();
        gulp.src([path.join(conf.paths.build, '**/*.js'), path.join(conf.paths.build, '**/*.css')])
            .pipe(vp)
            .pipe($.rename({
                suffix: revision
            }))
            .pipe(gulp.dest(path.join(conf.paths.build, '/')))
            .on('end', function () {
                $.del(vp.paths).then(resolve).catch(reject);
            });
    });
});


/**
 * Build all with self-revision
 */
gulp.task('build:all', ['build:rev'], function () {
    //display the size of dist finally when gzip
    return gulp.src(path.join(conf.paths.build, '/**/*'))
        .pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('build', ['build:clean', 'build:html', 'build:fonts', 'build:images', 'build:locales','build:js_components'], function () {
    //display the size of dist finally when gzip
    return gulp.src(path.join(conf.paths.build, '/**/*'))
        .pipe($.size({ title: 'build', gzip: true }));
});


/**
 * gzip test
 */
gulp.task('gz', function () {
    return gulp.src([
        path.join(conf.paths.build, '/tmp/**/*.js')
    ])
        .pipe($.gzip())
        .pipe(gulp.dest(path.join(conf.paths.build, '/tmp')));
});


/**
 * Create a distribution package zip
 */
gulp.task('dist', ['build:clean', 'build'], function () {
    var date = new Date().toISOString().replace(/[^0-9]/g, '');
    return gulp.src(path.join(conf.paths.build, '/**/*'))
        .pipe($.zip(conf.pkg.name + "-" + conf.pkg.version + "-BUILD" + date + ".zip"))
        .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('qiniu-186', function () {
    fs.writeFileSync(conf.paths.tmp + '/tmp_path_186.txt', '');
    return gulp.src([conf.paths.build + '/scripts/*.js', conf.paths.build + '/styles/*.css'])
        .pipe(intercept(function (file) {
            fs.appendFileSync(conf.paths.tmp + '/tmp_path_186.txt', file.path + '\r');
            // console.log('OLD CONTENT: ' + file.contents.toString() );
            // file.contents = new Buffer( "Hello!!!" );
            // console.log('NEW CONTENT: ' + file.contents.toString() );
            return file;
        }))
        .pipe(qiniu({
            accessKey: "WlfLj84tEqH7_FX-GhAnj30OmhreeeUYtBYgwnCN",
            secretKey: "O8efy3dIot_jv-xyh7kC_QBZ_2bUca5C4bdH7PXj",
            bucket: "operation",
            private: false
        }, {
            dir: 'assets/186',
            concurrent: 10
        }))
});

gulp.task('cdn-186', function () {
    var replace_param = {};
    console.log('cdn is start...');
    var cdn_url = 'http://p061ajqqc.bkt.clouddn.com/assets/186';
    // read all lines:

    var text = fs.readFileSync(conf.paths.tmp + '/tmp_path_186.txt', 'utf8');

    var text_arr = text.split('\r');

    for (var i = 0; i < text_arr.length - 1; i++) {
        console.log(text_arr[i]);
        var tmp_arr = text_arr[i].split('/');
        var tmp_reverse = tmp_arr.reverse();
        var newline = tmp_reverse[1] + '/' + tmp_reverse[0];
        replace_param[newline] = cdn_url + '/' + tmp_reverse[0];
    }

    console.log('the param is ' + replace_param);

    gulp.src([conf.paths.build + '/index.html'])
        .pipe(replace(replace_param))
        .pipe(gulp.dest(conf.paths.build));


});

gulp.task('build-186',  function(cb) {
    runSequence(
        'build',
        'qiniu-186',
        'cdn-186',
        cb);
});

/* 185 - dev */
gulp.task('qiniu-185', function () {
    fs.writeFileSync(conf.paths.tmp + '/tmp_path_185.txt', '');
    return gulp.src([conf.paths.build + '/scripts/*.js', conf.paths.build + '/styles/*.css'])
        .pipe(intercept(function (file) {
            fs.appendFileSync(conf.paths.tmp + '/tmp_path_185.txt', file.path + '\r');
            // console.log('OLD CONTENT: ' + file.contents.toString() );
            // file.contents = new Buffer( "Hello!!!" );
            // console.log('NEW CONTENT: ' + file.contents.toString() );
            return file;
        }))
        .pipe(qiniu({
            accessKey: "WlfLj84tEqH7_FX-GhAnj30OmhreeeUYtBYgwnCN",
            secretKey: "O8efy3dIot_jv-xyh7kC_QBZ_2bUca5C4bdH7PXj",
            bucket: "operation",
            private: false
        }, {
            dir: 'assets/185',
            concurrent: 10
        }))
});

gulp.task('cdn-185', function () {
    var replace_param = {};
    console.log('cdn is start...');
    var cdn_url = 'http://p061ajqqc.bkt.clouddn.com/assets/185';
    // read all lines:

    var text = fs.readFileSync(conf.paths.tmp + '/tmp_path_185.txt', 'utf8');

    var text_arr = text.split('\r');

    for (var i = 0; i < text_arr.length - 1; i++) {
        console.log(text_arr[i]);
        var tmp_arr = text_arr[i].split('/');
        var tmp_reverse = tmp_arr.reverse();
        var newline = tmp_reverse[1] + '/' + tmp_reverse[0];
        replace_param[newline] = cdn_url + '/' + tmp_reverse[0];
    }

    console.log('the param is ' + replace_param);

    gulp.src([conf.paths.build + '/index.html'])
        .pipe(replace(replace_param))
        .pipe(gulp.dest(conf.paths.build));


});

gulp.task('build-185',  function(cb) {
    runSequence(
        'build',
        'qiniu-185',
        'cdn-185',
        cb);
});