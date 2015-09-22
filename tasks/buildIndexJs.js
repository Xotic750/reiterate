/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:20,
    maxcomplexity:6
*/
/*global module */

(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.registerMultiTask(
      'buildIndexJs',
      'Build the index.js file.',
      function () {
        var templateFile = this.data.readme,
          destination = this.data.dest,
          template;

        if (grunt.file.exists(templateFile)) {
          template = grunt.file.read(templateFile);
        } else {
          throw new Error('Missing index.js template: ' + templateFile);
        }

        grunt.file.write(destination, template
          .replace(/@@DESCRIPTION/g, grunt.config.get('pkg.description'))
          .replace(/@@VERSION/g, grunt.config.get('pkg.version'))
          .replace(/@@AUTHORNAME/g, grunt.config.get('pkg.author.name'))
          .replace(/@@AUTHOREMAIL/g, grunt.config.get('pkg.author.email'))
          .replace(/@@HOMEPAGE/g, grunt.config.get('pkg.homepage'))
          .replace(/@@COPYRIGHT/g, grunt.config.get('pkg.copyright'))
          .replace(/@@LICENSE/g, grunt.config.get('pkg.licenses')[0].type)
          .replace(/@@LICLINK/g, grunt.config.get('pkg.licenses')[0].url)
          .replace(/@@ISSUES/g, grunt.config.get('pkg.bugs.url'))
          .replace(/@@MODULE/g, grunt.config.get('pkg.name')));

        grunt.log.writeln('File "' + destination + '" created.');
        grunt.log.writeln(this.target + ': OK');
      }
    );
  };
}());
