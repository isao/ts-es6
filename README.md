# ts-es6

Boilerplate for using Gulp to transpile TypeScript > es6/es2015 > Babel > es5. 

Some targets (node, latest chrome) support es6, so I thought it would be useful to provide an es6 version that could run as-is. Maybe not usefull in practice.

Also includes some Babel plug-ins for compile time optimizations.

Include sourcemaps, and an optional minification (via Uglify) command line option, i.e. `gulp --compress`. 

Build artifacts look like:

    dist
    ├── dts
    │   └── index.d.ts
    ├── es5
    │   ├── index.js
    │   └── index.js.map
    └── es6
        ├── index.js
        └── index.js.map


Inspired by http://github.com/filp/ts-es6-boilerplate.git and http://www.typescriptlang.org/docs/handbook/gulp.html
