import gulp from 'gulp';
import gulpIf from 'gulp-if';
import {env, log, PluginError} from 'gulp-util';
import merge from 'merge2';
import del from 'del'

/*
    typescript: transpile to es6, with definitions and source maps.
*/
import typescript from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
const tsProject = typescript.createProject('tsconfig.json');
const source = tsProject.config.include;
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

/*
    rollup: bundle es6 modules into a single file.
*/
import {rollup} from 'rollup';
gulp.task('rollup', ['tsc'], (cb) => {
    const config = {
        dest: 'dist/es6/bundle.js',
        format: 'es',
        sourceMap: true
    };

    return rollup({entry: 'dist/es6/index.js'})
        .then((bundle) => bundle.write(config));
});

/*
    clean, watch, default
*/
gulp.task('clean', () => del(['./dist/*']));
gulp.task('watch', ['rollup'], () => gulp.watch(source, ['rollup']));
gulp.task('default', ['rollup']);
