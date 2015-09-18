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
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      clean: {
        all: ['README.md', 'doc', 'lib', 'coverage'],
        after: ['coverage'],
        coverage: ['coverage']
      },

      buildReadme: {
        readme: {
          readme: 'templates/README.tpl',
          dest: 'README.md'
        }
      },

      jshint: {
        build: ['Gruntfile.js', 'src/*.js', 'tasks/**/*.js', 'tests/**/*.js'],
        lib: ['lib/<%= pkg.name %>.js'],
        options: {
          bitwise: true,
          camelcase: true,
          curly: true,
          eqeqeq: true,
          forin: true,
          freeze: true,
          futurehostile: true,
          latedef: true,
          newcap: true,
          nocomma: true,
          nonbsp: true,
          singleGroups: true,
          strict: true,
          undef: true,
          unused: true,
          esnext: true,
          plusplus: true,
          maxparams: 3,
          maxdepth: 4,
          maxstatements: 200,
          maxcomplexity: 7
        }
      },

      replace: {
        lib: {
          options: {
            patterns: [{
              match: 'VERSION',
              replacement: '<%= pkg.version %>'
            }, {
              match: 'MODULE',
              replacement: '<%= pkg.name %>'
            }, {
              match: 'DESCRIPTION',
              replacement: '<%= pkg.description %>'
            }, {
              match: 'AUTHORNAME',
              replacement: '<%= pkg.author.name %>'
            }, {
              match: 'AUTHOREMAIL',
              replacement: '<%= pkg.author.email %>'
            }, {
              match: 'HOMEPAGE',
              replacement: '<%= pkg.homepage %>'
            }, {
              match: 'COPYRIGHT',
              replacement: '<%= pkg.copyright %>'
            }, {
              match: 'LICENSE',
              replacement: '<%= pkg.licenses[0].type %>'
            }, {
              match: 'LICLINK',
              replacement: '<%= pkg.licenses[0].url %>'
            }]
          },
          files: [{
            src: ['src/<%= pkg.name %>.js'],
            dest: 'lib/<%= pkg.name %>.js'
          }]
        }
      },

      jsdoc: {
        lib: {
          jsdoc: 'node_modules/.bin/jsdoc',
          src: ['README.md', 'lib/<%= pkg.name %>.js'],
          options: {
            destination: 'doc',
            private: false,
            lenient: true
          }
        }
      },

      shell: {
        minify: {
          options: {
            stdout: true,
            stderr: true,
            failOnError: true,
            execOptions: {
              maxBuffer: 1048576
            }
          },
          command: ['java -jar',
            './node_modules/google-closure-compiler/compiler.jar',
            '--compilation_level=WHITESPACE_ONLY',
            '--language_in=ECMASCRIPT6_STRICT',
            '--js_output_file=lib/<%= pkg.name %>.min.js',
            '--js lib/<%= pkg.name %>.js'
          ].join(' ')
        },
        beautified: {
          options: {
            stdout: true,
            stderr: true,
            failOnError: true,
            execOptions: {
              maxBuffer: 1048576
            }
          },
          command: 'export TEST_NAME=<%= pkg.name %>; <%= pkg.scripts.test %>'
        },
        coveralls: {
          options: {
            stdout: false,
            stderr: true,
            failOnError: true,
            execOptions: {
              maxBuffer: 1048576
            }
          },
          command: ['export TEST_NAME=<%= pkg.name %>;',
            './node_modules/istanbul/lib/cli.js cover --report lcovonly',
            './node_modules/mocha/bin/_mocha --',
            '--check-leaks -u bdd -t 10000 -b -R tap tests/*.js',
            '&&',
            'cat ./coverage/lcov.info',
            '|',
            './node_modules/coveralls/bin/coveralls.js'
          ].join(' ')
        },
        uglified: {
          options: {
            stdout: true,
            stderr: true,
            failOnError: true,
            execOptions: {
              maxBuffer: 1048576
            }
          },
          command: ['export TEST_NAME=<%= pkg.name %>.min;',
            '<%= pkg.scripts.test %>'
          ].join(' ')
        }
      }
    });

    // Custom tasks.
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', [
      'clean:all',
      'jshint:build',
      'replace:lib',
      'jshint:lib',
      'shell:beautified',
      'shell:minify',
      'shell:uglified',
      'buildReadme',
      'jsdoc',
      'clean:after'
    ]);

    grunt.registerTask('test', [
      'shell:beautified',
      'shell:uglified'
    ]);

    grunt.registerTask('coveralls', [
      'clean:coverage',
      'shell:coveralls',
      'clean:coverage'
    ]);
  };
}());
