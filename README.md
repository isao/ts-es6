# ts-es6

Boilerplate for using Gulp to transpile TypeScript > es6/es2015 > Babel > es5. 

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


Inspired by github.com:filp/ts-es6-boilerplate.git
