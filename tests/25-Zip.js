/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Zip', function () {
      var a = [30, 40],
        b = [true, false],
        array = reiterate(['fred', 'barney']).zip(a, b).valueOf();

      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      a = reiterate([30, 40]);
      b = reiterate([true, false]);
      array = reiterate(['fred', 'barney']).zip(a, b).valueOf();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      a = reiterate([30]);
      b = reiterate([true, false]);
      array = reiterate(['fred', 'barney', 'wilma']).zip(a, b).valueOf();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      a = reiterate([30]);
      b = {
        a: true,
        b: false
      };

      array = reiterate(['fred', 'barney', 'wilma']).zip(a, b).valueOf();
      expect(array).to.eql([
        ['fred', 30],
        ['barney', undefined],
        ['wilma', undefined]
      ]);

      a = reiterate([30]);
      b = reiterate({
        a: true,
        b: false
      });

      array = reiterate(['fred', 'barney', 'wilma']).zip(a, b).valueOf();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      a = [30, 40];
      b = [];
      array = reiterate(['fred', 'barney']).zip(a, b).valueOf();
      expect(array).to.eql([
        ['fred', 30, undefined],
        ['barney', 40, undefined]
      ]);

      a = [30, 40];
      b = [true, false];
      array = reiterate([]).zip(a, b).valueOf();
      expect(array).to.eql([
        [undefined, 30, true],
        [undefined, 40, false]
      ]);

      a = [];
      b = [];
      array = reiterate([]).zip(a, b).valueOf();
      expect(array).to.eql([]);
    });
  });
}());
