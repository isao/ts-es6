import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import merge from 'merge2';
import del from 'del'

/*
    typescript
*/
import typescript from 'gulp-typescript';
const tsProject = typescript.createProject('tsconfig.json');
const es6Out = tsProject.config.compilerOptions.outDir;
const dtsOut = tsProject.config.compilerOptions.declarationDir;
gulp.task('tsc', ['clean'], () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.dts
            .pipe(gulp.dest(dtsOut)),

        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(es6Out)),
    ])
});

/*
    babel
*/
import babel from 'gulp-babel';
const es6In = es6Out + '/**/*.js';
const es5Out = './dist/es5';
gulp.task('es5', ['tsc'], () => {
    return gulp.src(es6In)
        .pipe(sourcemaps.init({loadmaps: true}))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(es5Out));
});


gulp.task('clean', () => del(['./dist/*']));

gulp.task('watch', ['tsc'], () => gulp.watch('./src/**/*', ['tsc']));

gulp.task('default', ['tsc']);
