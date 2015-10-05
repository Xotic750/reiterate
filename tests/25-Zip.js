/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:56,
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
        i = ['fred', 'barney'],
        array = reiterate(i).zip(a, b).asArray(),
        x,
        y,
        u;

      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([i, a, b]);

      x = reiterate(a);
      y = reiterate(b);
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([i, a, b]);

      x = reiterate([30]);
      y = reiterate(b);
      i = ['fred', 'barney', 'wilma'];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined],
        [true, false, undefined]
      ]);

      x = reiterate([30]);
      y = {
        a: true,
        b: false
      };

      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30],
        ['barney', undefined],
        ['wilma', undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined]
      ]);

      x = reiterate([30]);
      y = reiterate({
        a: true,
        b: false
      });

      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined],
        [true, false, undefined]
      ]);

      x = a;
      y = [];
      i = ['fred', 'barney'];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, undefined],
        ['barney', 40, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, 40],
        [undefined, undefined]
      ]);

      x = a;
      y = b;
      i = [];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        [undefined, 30, true],
        [undefined, 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        [undefined, undefined],
        [30, 40],
        [true, false]
      ]);

      x = [];
      y = [];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([]);

      x = ['fred', 30, true];
      y = ['barney', 40, false];
      u = reiterate.unzip({a: x, b: y}).asArray();
      expect(u).to.eql([]);

      i = ['fred', 'barney'];
      u = reiterate.unzip(reiterate({a: x, b: y})).asArray();
      expect(u).to.eql([i, a, b]);
    });
  });
}());
