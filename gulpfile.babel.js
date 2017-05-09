import gulp from 'gulp';
import gulpIf from 'gulp-if';
import {env, log, PluginError} from 'gulp-util';
import merge from 'merge2';
import del from 'del'

// Resolve command line flags --sourcemaps and --minify.
const sourcemapsOn = !env.hasOwnProperty('sourcemaps') || env.sourcemaps;
const minifyOn = env.minify;

gulp.task('help', () => log(`
Tasks (default is "build"):
    build           Same as "es5", does the full transpilation and bundling.
    typescript      Transpile Typescript to ES2015 (ES6).
    bundle          Bundle ES2015 modules into a single file.
    es5             Transpile the ES2015 bundle to ES5, optionally minify.
    watch           Watch for source file changes and re-run tasks.

Options:
    --sourcemaps    Create external sourcemap files (enabled by default).
    --minify        Compress the output bundle (disabled by default).

Input and output paths are specified in tsconfig.json.
`));



/*
    Transpile to es6, with type definitions, and source maps.
*/
import typescript from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
const tsProject = typescript.createProject('tsconfig.json');
const sources = tsProject.config.include;
const es6Out = tsProject.config.compilerOptions.outDir;
const dtsOut = tsProject.config.compilerOptions.declarationDir;
gulp.task('typescript', ['clean'], (cb) => {
    var tscErrorCount = 0;

    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', (er) => new PluginError('typescript', er, {count: tscErrorCount++}))
        .on('finish', () => tscErrorCount && process.exit(1));

    return merge([
        tsResult.dts
            .pipe(gulp.dest(dtsOut)),
        tsResult.js
            .pipe(gulpIf(sourcemapsOn, sourcemaps.write('.')))
            .pipe(gulp.dest(es6Out)),
    ]);
});

/*
    Bundle es6 modules into a single file.
*/
import {rollup} from 'rollup';
const {entry, destDir} = tsProject.config.gulpOptions;
const rollupOut = {
    dest: entry,
    format: 'es',
    sourceMap: true,
};
gulp.task('bundle', ['typescript'],
    (cb) => rollup({entry}).then((bundle) => bundle.write(rollupOut))
);

/*
    Transpile es6 to es5, and optionally compress it.
*/
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
gulp.task('es5', ['bundle'], (cb) => {
    gulp.src(entry)
        .pipe(gulpIf(sourcemapsOn, sourcemaps.init({loadMaps: true})))
        .pipe(babel())
        .pipe(gulpIf(minifyOn, uglify()))
        .pipe(gulpIf(sourcemapsOn, sourcemaps.write('.')))
        .pipe(gulp.dest(destDir));
});

/*
    clean, watch, default, help.
*/
gulp.task('clean', () => del([destDir + '/*']));
gulp.task('watch', ['bundle'], () => gulp.watch(sources, ['bundle']));
gulp.task('default', ['build']);
gulp.task('build', ['es5']);
