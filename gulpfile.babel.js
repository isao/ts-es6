import gulp from 'gulp';
import gulpIf from 'gulp-if';
import {env, log, PluginError} from 'gulp-util';
import merge from 'merge2';
import del from 'del'

/*
    clean, watch, default
*/
gulp.task('clean', () => del(['./dist/*']));
gulp.task('watch', ['rollup'], () => gulp.watch('./src/**/*', ['rollup']));
gulp.task('default', ['rollup']);

/*
    typescript: transpile to es6, with definitions and source maps.
*/
import typescript from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
const tsProject = typescript.createProject('tsconfig.json');
const es6Out = tsProject.config.compilerOptions.outDir;
const dtsOut = tsProject.config.compilerOptions.declarationDir;
gulp.task('tsc', ['clean'], (cb) => {
    var tscErrorCount = 0;

    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', (er) => new PluginError('tsc', er, {count: tscErrorCount++}))
        .on('finish', () => tscErrorCount && process.exit(1));

    return merge([
        tsResult.dts
            .pipe(gulp.dest(dtsOut)),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(es6Out)),
    ]);
});

import {rollup} from 'rollup';

gulp.task('rollup', ['tsc'], (cb) => {
    return rollup({entry: 'dist/es6/index.js'})
        .then((bundle) => bundle.write({
            format: 'es',
            dest: 'dist/es6/bundle.js'
        }));
});


/*
    babel: transpile es6 to es5, with sourcemaps and plugins (see package.json).
*/
//import babel from 'gulp-babel';
//import uglify from 'gulp-uglify';
//const es6In = es6Out + '/**/*.js';
//const es5Out = './dist/es5';
//gulp.task('es5', ['tsc'], (cb) => {
//    return gulp.src(es6In)
//        .pipe(sourcemaps.init({loadmaps: true}))
//        .pipe(babel())
//        .pipe(gulpIf(env.compress, uglify()))
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest(es5Out));
//});
