/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    isGeneratorSupported = required.isGeneratorSupported,
    symIt = required.iterator;

  describe('Basic tests', function () {
    it('Other iterables', function () {
      var array,
        a;

      if (typeof Map === 'function' && !reiterate.useShims) {
        a = new Map().set(0, 1).set(1, 2).set(2, 3);
      } else {
        a = new reiterate.Map().set(0, 1).set(1, 2).set(2, 3);
      }

      array = reiterate(a).asArray();
      expect(array).to.eql([
        [0, 1],
        [1, 2],
        [2, 3]
      ]);

      array = reiterate(a.values()).asArray();
      expect(array).to.eql([1, 2, 3]);
      array = reiterate(a.keys()).asArray();
      expect(array).to.eql([0, 1, 2]);
      if (typeof Set === 'function' && !reiterate.useShims) {
        a = new Set().add(0).add(1).add(2);
      } else {
        a = new reiterate.Set().add(0).add(1).add(2);
      }

      array = reiterate(a).asArray();
      expect(array).to.eql([0, 1, 2]);

      a = {
        a: 1,
        b: 2,
        c: 3
      };

      if (isGeneratorSupported && !reiterate.useShims) {
        /*jshint evil:true */
        a[symIt] = new Function('return function*(){for(var key in this)' +
          'if(this.hasOwnProperty(key))yield this[key]};')();
      } else {
        a[symIt] = function () {
          var index = 0,
            iterable = this,
            keys;

          return {
            next: function () {
              var object;

              keys = keys || (function () {
                var result = [],
                  key;

                for (key in iterable) {
                  if (key !== symIt &&
                    Object.prototype.hasOwnProperty.call(iterable, key)) {
                    result.push(iterable[key]);
                  }
                }

                return result;
              }());

              if (index < keys.length) {
                object = {
                  done: false,
                  value: keys[index]
                };

                index += 1;
              } else {
                object = {
                  done: true,
                  value: undefined
                };
              }

              return object;
            }
          };
        };
      }

      array = reiterate(a).asArray();
      expect(array.sort()).to.eql([1, 2, 3]);

      if (isGeneratorSupported && !reiterate.useShims) {
        /*jshint evil:true */
        a[symIt] = new Function('return function*(){for(var key in this)' +
          'if(this.hasOwnProperty(key))yield key};')();
      } else {
        a[symIt] = function () {
          var index = 0,
            iterable = this,
            keys;

          return {
            next: function () {
              var object;

              keys = keys || (function () {
                var result = [],
                  key;

                for (key in iterable) {
                  if (key !== symIt &&
                      Object.prototype.hasOwnProperty.call(iterable, key)) {
                    result.push(key);
                  }
                }

                return result;
              }());

              if (index < keys.length) {
                object = {
                  done: false,
                  value: keys[index]
                };

                index += 1;
              } else {
                object = {
                  done: true,
                  value: undefined
                };
              }

              return object;
            }
          };
        };
      }

      array = reiterate(a).asArray();
      expect(array).to.eql(['a', 'b', 'c']);

      array = reiterate(a).join();
      expect(array).to.be('a,b,c');

      array = reiterate(a).asString();
      expect(array).to.be('abc');
    });
  });
}());
