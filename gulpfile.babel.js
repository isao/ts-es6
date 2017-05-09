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

const sources = tsProject.config.include;
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
const {entry, destDir} = tsProject.config.gulpOptions;
const output = {
    dest: entry,
    format: 'es',
    sourceMap: true,
};
gulp.task('rollup', ['tsc'], (cb) => {
    return rollup({entry}).then((bundle) => bundle.write(output));
});

/*
    transpile es6 to es5, and optionally compress it.
*/
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
gulp.task('es5', ['rollup'], (cb) => {
    gulp.src(entry)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .pipe(gulpIf(env.compress, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destDir));
});


/*
    clean, watch, default
*/
gulp.task('clean', () => del([destDir + '/*']));
gulp.task('watch', ['rollup'], () => gulp.watch(sources, ['rollup']));
gulp.task('default', ['rollup']);
