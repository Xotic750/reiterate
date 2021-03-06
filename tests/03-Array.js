/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:56,
    maxcomplexity:10
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf,
    map = reiterate.$.map;

  describe('Basic tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        array;

      // forward
      forOf(reiterate(a), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate([]).values(), function () {
        index += 1;
      });

      expect(index).to.be(0);

      index = 0;
      forOf(reiterate(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate(a).reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().unique().asSet(reiterate.$.Set);
      expect(array.size).to.be(b.length);
      array.forEach(function (item) {
        expect(b.indexOf(item)).to.not.be(-1);
      });

      // map
      array = reiterate(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a, function (item) {
        return String(item);
      }));

      array = reiterate(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a.slice().reverse(), function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate(d).values().flatten().asArray();
      expect(array).to.eql(a);
    });

    it('Array slice', function () {
      var a = [1, 2, 3, 4, 5],
        gen = reiterate(a).keys().slice(1, -1),
        index;

      // forward
      index = 1;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index += 1;
      });

      gen = reiterate(a).keys().slice(-1);
      forOf(gen, function (entry) {
        expect(entry).to.eql(4);
      });

      gen = reiterate(a).keys().slice(1, 3);
      index = 1;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, 3);
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      gen = reiterate(a).keys().slice(1, -1).reverse();
      index = a.length - 2;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index -= 1;
      });
    });

    it('Array filter', function () {
      var a = [1, 2, 3, 4, 5],
        index,
        counter;

      expect(function () {
        forOf(reiterate(a).filter(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate(a).filter(function (value) {
          return value >= 2 && value <= 4;
        });
      }).to.not.throwException();

      index = 2;
      forOf(counter, function (entry) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Array filter map', function () {
      var a = reiterate().from(65).to(90).asArray(),
        index,
        counter;

      expect(function () {
        counter = reiterate(a).filter(function (entry) {
          return entry >= 80 && entry <= 85;
        }).map(function (entry) {
          return String.fromCharCode(entry);
        });
      }).to.not.throwException();

      index = 80;
      forOf(counter, function (entry) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
    });

    it('Array filter asArray', function () {
      var a = reiterate().to(10).asArray(),
        array;

      expect(function () {
        array = reiterate(a).values().filter(function (value) {
          return value >= 4 && value <= 6;
        }).asArray();
      }).to.not.throwException();

      expect(array).to.eql([4, 5, 6]);
    });

    it('Counter every', function () {
      var index = 10,
        a = reiterate().from(10).to(20).asArray(),
        e;

      expect(function () {
        forOf(reiterate(a).every(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });


      e = reiterate(a).values().every(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'number';
      });

      expect(e).to.be(true);
      index = 10;
      e = reiterate(a).values().every(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'string';
      }, true);

      expect(e).to.be(false);
    });

    it('Array some', function () {
      var a = reiterate().from(10).to(20).asArray(),
        index = 10,
        s;

      expect(function () {
        forOf(reiterate(a).some(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      s = reiterate(a).values().some(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 15;
      });

      expect(s).to.be(true);
      index = 10;
      s = reiterate(a).values().some(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 0;
      }, true);

      expect(s).to.be(false);
    });

    it('Array drop', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().drop().asArray();
      expect(array).to.eql(a);

      // forward
      array = reiterate(a).values().drop(2).asArray();
      expect(array).to.eql([3, 4, 5]);

      // reverse
      array = reiterate(a).values().reverse().drop(2).asArray();
      expect(array).to.eql([3, 2, 1]);
    });

    it('Array take', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().take().asArray();
      expect(array).to.eql([]);

      // forward
      array = reiterate(a).values().take(2).asArray();
      expect(array).to.eql([1, 2]);

      // reverse
      array = reiterate(a).values().reverse().take(2).asArray();
      expect(array).to.eql([5, 4]);
    });

    it('Array state', function () {
      var gen = reiterate([]).keys().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: false,
        keys: true
      });
    });
  });
}());
