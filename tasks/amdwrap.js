/*!
 * grunt-amdwrap
 * http://gruntjs.com/
 *
 * Author: Viacheslav Lotsmanov
 * License: GNU/GPLv3 by Free Software Foundation
 * https://github.com/unclechu/grunt-amdwrap/blob/master/LICENSE
 */

module.exports =
function amdwrap(grunt) {
    'use strict';
    /*jshint multistr: true */

    var path = require('path');

    var lf = grunt.util.linefeed;

    grunt.registerMultiTask('amdwrap', 'Wrap JS-AMD-modules.', function () {

        var counter = 0;

        var options = this.options({
            dir: '',
        });

        this.files.forEach(function (filePair) {

            var isExpandedPair = filePair.orig.expand || false;
            var dest;

            filePair.src.forEach(function (src) {

                dest = grunt.file.isDir(filePair.dest) && !isExpandedPair ?
                    path.join(filePair.dest || '', src) : filePair.dest;

                if (grunt.file.isDir(src)) {

                    grunt.file.mkdir(dest);

                } else {

                    grunt.log.write('Wrapping '+ src.cyan +' -> '+ dest.cyan +'...');
                    grunt.file.write(dest, wrap(src, options, filePair.orig.cwd));
                    grunt.log.ok();
                    counter++;

                }

            });

        });

        grunt.log.write('Wrapped '+ counter.toString().cyan +' files');

    });

    function wrap(filepath, options, cwd) {

        var fileContents = grunt.file.read(filepath);
        var moduleId = path.join(options.dir);
        var newFilepath;

        if (cwd) cwd = path.join(cwd); else cwd = '';
        if (cwd !== '') {
            if (cwd.substr(-1) != '/') cwd += '/';
            newFilepath = filepath.replace(new RegExp('^' + cwd), '');
            moduleId = path.join(moduleId, newFilepath).replace(/\.js$/, '');
        }

        var result = ';(function isolate() {';

        result += ("\
            function define() {\
                var args = Array.prototype.slice.call(arguments, 0);\
                if (typeof args[0] !== 'string') {\
                    args.unshift('"+ moduleId +"');\
                }\
                window.define.apply(this, args);\
            }\
            define.amd = { jQuery: true };\
        ").replace(/\s+/g, ' ');

        result += lf + fileContents + lf;

        result += '})();';

        return result.replace(/(\r\n|\r|\n)/g, lf);
        
    }
};
