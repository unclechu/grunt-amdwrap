grunt-amdwrap
=============

A Grunt plugin for wrapping JS-modules written in AMD style

Wrap your AMD modules before concat with [RequireJS](http://requirejs.org/)

Wrapped AMD modules will have ids by local "define" wrappers

Getting Started
===============

Install this grunt plugin next to your project's
[grunt.js gruntfile](http://gruntjs.com/getting-started "Getting Started")
with: ``npm install grunt-amdwrap``

Then add this line to your project's ``grunt.js`` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-amdwrap');
```

Documentation
=============

```javascript
grunt.initConfig({
    amdwrap: {
        libs: {
            options: { dir: 'libs' },
            files: [
                {
                    expand: true,
                    cwd: 'scripts/libs/',
                    src: [ '**/*.js' ],
                    dest: 'scripts/build/wrap/libs/',
                },
            ],
        },
        src: {
            files: [
                {
                    expand: true,
                    cwd: 'scripts/src/',
                    src: [ '**/*.js' ],
                    dest: 'scripts/build/wrap/',
                },
            ],
        },
    },
});
```

Wrapper code
============

```javascript
;(function isolate() {

    function define() {
        define.defined = true;
        var args = Array.prototype.slice.call(arguments, 0);
        if (typeof args[0] !== 'string') {
            args.unshift('%MODULE_ID%');
        }
        window.define.apply(this, args);
    }
    define.amd = { jQuery: true };

    // module contents

})();
```

Author
======

Viacheslav Lotsmanov

License
=======

GNU/GPLv3 by Free Software Foundation
