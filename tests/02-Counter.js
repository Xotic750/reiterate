/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:2, maxstatements:52,
    maxcomplexity:15
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  function* times2(subject) {
    for (var item of subject) {
      yield item * 2;
    }
  }

  describe('Basic tests', function () {
    it('Counter simple', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(9)) {
        expect(entry).to.be.within(0, 9);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(undefined).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(null).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = -9;
      for (entry of reiterate(-9).reverse()) {
        expect(entry).to.be.within(-9, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter specific arguments', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 10;
      for (entry of reiterate(10, -20)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -20;
      for (entry of reiterate(-20, -10)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(-10, 0).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -10;
      for (entry of reiterate(0, -10).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter with by', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10, 1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0, 2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate(10, -20, 3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate(-20, -10, -2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10, 1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0, 2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate(-10, 0, 3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate(0, -10, -2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter simple mixed sugar', function () {
      var index = 10,
        entry;

      // forward
      for (entry of reiterate().from(10)) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 20) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined).to(10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null).by(2)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate().from(10).to(20).by(2)) {
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().from(10).reverse()) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate(undefined).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 10;
      for (entry of reiterate().from(0).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 2;
      }
    });

    it('Counter using sugar', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate().from(0).to(10).by(1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate().from(-10).to(0).by(2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate().from(10).to(-20).by(3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate().from(-20).to(-10).by(2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate().from(0).to(10).by(1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(10).to(0).by(2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate().from(0).to(-10).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate(0, 0, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      index = 0;
      for (entry of reiterate().to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate().from(0).to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate().from(0).to(0).by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate().by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter limits', function () {
      var entry;

      for (entry of reiterate().from(-Infinity).to(Infinity)) {
        expect(entry).to.be(Number.MIN_SAFE_INTEGER);
        break;
      }

      for (entry of reiterate().from(Infinity).to(-Infinity)) {
        expect(entry).to.be(Number.MAX_SAFE_INTEGER);
        break;
      }
    });

    it('Counter next', function () {
      var generator = reiterate().from(0).to(3).by(1),
        iterator = generator[Symbol.iterator]();

      expect(iterator.next()).to.eql({
        value: 0,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 1,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 2,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 3,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: undefined,
        done: true
      });
    });

    it('Counter already started', function () {
      var generator = reiterate(),
        iterator = generator[Symbol.iterator]();

      expect(iterator.next()).to.eql({
        value: 0,
        done: false
      });

      expect(function () {
        iterator.from(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.to(3);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.by(1);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter map', function () {
      var index,
        entry,
        counter;

      expect(function () {
        for (entry of reiterate().map()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 65;
      for (entry of counter) {
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Counter filter', function () {
      var index,
        entry,
        counter;

      expect(function () {
        for (entry of reiterate().filter()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate().to(10).filter(function (value) {
          return value >= 4 && value <= 6;
        });
      }).to.not.throwException();

      index = 4;
      for (entry of counter) {
        expect(entry).to.be.within(4, 6);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter filter map', function () {
      var index,
        entry,
        counter;

      expect(function () {
        counter = reiterate().from(65).to(90).filter(function (value) {
          return value >= 80 && value <= 85;
        }).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 80;
      for (entry of counter) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Counter map filter', function () {
      var index,
        entry,
        counter;

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        }).filter(function (value) {
          return value >= 'P' && value <= 'U';
        });
      }).to.not.throwException();

      index = 80;
      for (entry of counter) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Counter toArray', function () {
      var array;

      expect(function () {
        array = reiterate().to(3).toArray();
      }).to.not.throwException();

      expect(array).to.eql([0, 1, 2, 3]);
    });

    it('Counter map toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(65).to(68).map(function (value) {
          return String.fromCharCode(value);
        }).toArray();
      }).to.not.throwException();

      expect(array).to.eql(['A', 'B', 'C', 'D']);
    });

    it('Counter filter toArray', function () {
      var array;

      expect(function () {
        array = reiterate().to(10).filter(function (value) {
          return value >= 4 && value <= 6;
        }).toArray();
      }).to.not.throwException();

      expect(array).to.eql([4, 5, 6]);
    });

    it('Counter map unique toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).unique().toArray();
      }).to.not.throwException();

      expect(array).to.eql(['a']);
    });

    it('Counter map filter unique toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).filter(function () {
          return true;
        }).unique().toArray();
      }).to.not.throwException();

      expect(array).to.eql(['a']);
    });

    it('Counter then undefined', function () {
      var index = 0,
        value,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then();
      }).to.not.throwException();

      for (value of iterator) {
        expect(index).to.be.within(0, 10);
        expect(value).to.be(index);
        index += 1;
      }
    });

    it('Counter then times2', function () {
      var index = 0,
        value,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then(times2);
      }).to.not.throwException();

      for (value of iterator) {
        expect(index).to.be.within(0, 10);
        expect(value).to.be(index * 2);
        index += 1;
      }
    });

    it('Counter then toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(times2).toArray();
      }).to.not.throwException();

      expect(array).to.eql([0, 2, 4, 6]);
    });

    it('Counter then map toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(times2).map(function (value) {
          return value * 2;
        }).toArray();
      }).to.not.throwException();

      expect(array).to.eql([0, 4, 8, 12]);
    });

    it('Counter then filter toArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(times2).filter(function (value) {
          return value >= 2 && value <= 4;
        }).toArray();
      }).to.not.throwException();

      expect(array).to.eql([2, 4]);
    });

    it('Counter using sugar', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate().from(0).to(10).by(1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate().from(-10).to(0).by(2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate().from(10).to(-20).by(3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate().from(-20).to(-10).by(2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate().from(0).to(10).by(1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(10).to(0).by(2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate().from(0).to(-10).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter each', function () {
      var index = 10;

      expect(function () {
        var entry;

        for (entry of reiterate().each()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      reiterate().from(10).to(20).each(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      });

      index = 10;
      reiterate().from(10).to(20).each(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        var arr = object.toArray();

        expect(entry).to.be(arr[index - 10]);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      }, true);

      // reverse
      index = 20;
      reiterate().from(10).to(20).reverse().each(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 20;
      reiterate().from(10).to(20).reverse().each(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      }, true);
    });

    it('Counter every', function () {
      var index = 10,
        e;

      expect(function () {
        var entry;

        for (entry of reiterate().every()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      e = reiterate().from(10).to(20).every(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'number';
      });

      expect(e).to.be(true);
      index = 10;
      e = reiterate().from(10).to(20).every(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        var arr = object.toArray();

        expect(entry).to.be(arr[index - 10]);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'string';
      }, true);

      expect(e).to.be(false);

      // reverse
      index = 20;
      e = reiterate().from(10).to(20).reverse().every(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
        return entry >= 10 && entry <= 20;
      });

      expect(e).to.be(true);
      index = 20;
      e = reiterate().from(10).to(20).reverse().every(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
        return entry >= 15;
      }, true);

      expect(e).to.be(false);
    });

    it('Counter reduce', function () {
      var index = 10,
        r;

      expect(function () {
        var entry;

        for (entry of reiterate().reduce()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      r = reiterate().from(10).to(20).reduce(function (acc, entry) {
        expect(acc).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return acc;
      }, undefined);

      expect(r).to.be(undefined);
      index = 11;
      r = reiterate().from(10).to(20).reduce(function (acc, entry) {
        expect(acc).to.be.a('number');
        expect(entry).to.be.within(11, 20);
        expect(entry).to.be(index);
        index += 1;
        return acc;
      });

      expect(r).to.be(10);
      index = 10;
      r = reiterate().from(10).to(20).reduce(function (acc, entry, object) {
        expect(acc).to.be.an('array');
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        var arr = object.toArray();

        expect(entry).to.be(arr[index - 10]);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        acc.push(entry);
        return acc;
      }, []);

      expect(r).to.eql(reiterate().from(10).to(20).toArray());

      // reverse
      index = 12;
      r = reiterate().from(10).to(12).reverse().reduce(function (acc, entry) {
        expect(acc).to.be.an('object');
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        acc[12 - index] = entry;
        index -= 1;
        return acc;
      }, {});

      expect(r).to.eql({
        0: 12,
        1: 11,
        2: 10
      });

      index = 19;
      r = reiterate().to(20).reverse().reduce(function (acc, entry, object) {
        expect(acc).to.be.a('number');
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        expect(entry).to.be.within(0, 19);
        expect(entry).to.be(index);
        index -= 1;
        return acc + entry;
      });

      expect(r).to.be(210);
    }, 0);

    it('Counter some', function () {
      var index = 10,
        s;

      expect(function () {
        var entry;

        for (entry of reiterate().some()) {
          break;
        }
      }).to.throwException(function (s) {
        expect(s).to.be.a(TypeError);
      });

      // forward
      s = reiterate().from(10).to(20).some(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 15;
      });

      expect(s).to.be(true);
      index = 10;
      s = reiterate().from(10).to(20).some(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        var arr = object.toArray();

        expect(entry).to.be(arr[index - 10]);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 0;
      }, true);

      expect(s).to.be(false);

      // reverse
      index = 20;
      s = reiterate().from(10).to(20).reverse().some(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
        return entry === 15;
      });

      expect(s).to.be(true);
      index = 20;
      s = reiterate().from(10).to(20).reverse().some(function (entry, object) {
        expect(this).to.be(true);
        expect(object).to.be.a(Object);
        expect(object[Symbol.iterator]).to.be.a('function');
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
        return entry === 21;
      }, true);

      expect(s).to.be(false);
    });

    it('Counter join', function () {
      var s;

      // forward
      s = reiterate().from(0).to(2).join();
      expect(s).to.be('0,1,2');

      // reverse
      s = reiterate().from(0).to(2).reverse().join();
      expect(s).to.be('2,1,0');
    });

    it('Counter state', function () {
      var gen = reiterate().from(1).to(100).by(2).reverse(),
        state = gen.state();

      expect(state).to.eql({
        reversed: true,
        from: 1,
        to: 100,
        by: 2
      });
    });
  });
}());
