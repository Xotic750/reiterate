/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:4, maxdepth:2, maxstatements:52,
    maxcomplexity:15
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    symIt = required.iterator,
    forOf = required.forOf,
    reduce = required.reduce,
    isGeneratorSupported = required.isGeneratorSupported,
    aGenerator;

  if (isGeneratorSupported) {
    /*jshint evil:true */
    aGenerator = new Function('reduce', 'return function*(){var x=reduce(' +
      'arguments,function(acc,arg){return acc+arg},0),item;' +
      'for(item of this)yield item*2+x};')(reduce);
  } else {
    aGenerator = function () {
      var generator = this,
        args = arguments,
        iterator,
        next,
        done,
        x;

      return {
        next: function () {
          var object;

          if (!done) {
            x = reduce(args, function (acc, arg) {
              return acc + arg;
            }, 0);

            done = true;
          }

          iterator = iterator || generator[symIt]();
          next = iterator.next();
          if (!next.done) {
            object = {
              done: false,
              value: next.value * 2 + x
            };
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

  describe('Basic tests', function () {
    it('Counter simple', function () {
      var index = 0;

      // forward
      forOf(reiterate(), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(undefined), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(null), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(9), function (entry) {
        expect(entry).to.be.within(0, 9);
        expect(entry).to.be(index);
        index += 1;
      });

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      forOf(reiterate().reverse(), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = Number.MAX_SAFE_INTEGER;
      forOf(reiterate(undefined).reverse(), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = Number.MAX_SAFE_INTEGER;
      forOf(reiterate(null).reverse(), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = -9;
      forOf(reiterate(-9).reverse(), function (entry) {
        expect(entry).to.be.within(-9, 0);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter specific arguments', function () {
      var index = 0;

      // forward
      forOf(reiterate(0, 10), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate(-10, 0), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      });

      index = 10;
      forOf(reiterate(10, -20), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = -20;
      forOf(reiterate(-20, -10), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 1;
      });

      // reverse
      index = 10;
      forOf(reiterate(0, 10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate(10, 0).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(-10, 0).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = -10;
      forOf(reiterate(0, -10).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter with by', function () {
      var index = 0;

      // forward
      forOf(reiterate(0, 10, 1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate(-10, 0, 2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate(10, -20, 3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate(-20, -10, -2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate(0, 10, 1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate(10, 0, 2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate(-10, 0, 3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate(0, -10, -2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter zeros', function () {
      var index = 0;

      index = 0;
      forOf(reiterate(0), function (entry) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(0, 0), function (entry) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      });

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter simple mixed sugar', function () {
      var index = 10;

      // forward
      forOf(reiterate().from(10), function (entry) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 20) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(undefined).to(10), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(null).by(2), function (entry) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          return true;
        }
      });

      index = 10;
      forOf(reiterate().from(10).to(20).by(2), function (entry) {
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      forOf(reiterate().from(10).reverse(), function (entry) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = 10;
      forOf(reiterate(undefined).to(10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 10;
      forOf(reiterate().from(0).to(10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 2;
      });
    });

    it('Counter using sugar', function () {
      var index = 0;

      // NaN
      forOf(reiterate().from(NaN).to(NaN).by(1), function (entry) {
        expect(entry).to.be(0);
        index += 1;
      });

      // forward
      index = 0;
      forOf(reiterate().from(0).to(10).by(1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate().from(-10).to(0).by(2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate().from(10).to(-20).by(3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate().from(-20).to(-10).by(2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate().from(0).to(10).by(1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(10).to(0).by(2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate().from(0).to(-10).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter zeros', function () {
      var index = 0;

      index = 0;
      forOf(reiterate(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(0, 0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      expect(function () {
        reiterate(0, 0, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      index = 0;
      forOf(reiterate().to(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate().from(0).to(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

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

      expect(function () {
        reiterate().by(NaN);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter limits', function () {
      forOf(reiterate().from(-Infinity).to(Infinity), function (entry) {
        expect(entry).to.be(Number.MIN_SAFE_INTEGER);
        return true;
      });

      forOf(reiterate().from(Infinity).to(-Infinity), function (entry) {
        expect(entry).to.be(Number.MAX_SAFE_INTEGER);
        return true;
      });
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
        counter;

      expect(function () {
        forOf(reiterate().map(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 65;
      forOf(counter, function (entry) {
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
    });

    it('Counter map filter', function () {
      var index,
        counter;

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        }).filter(function (value) {
          return value >= 'P' && value <= 'U';
        });
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      index = 80;
      forOf(counter, function (entry) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
    });

    it('Counter asArray', function () {
      var array;

      expect(function () {
        array = reiterate().to(3).asArray();
      }).to.not.throwException();

      expect(array).to.eql([0, 1, 2, 3]);
    });

    it('Counter map asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(65).to(68).map(function (value) {
          return String.fromCharCode(value);
        }).asArray();
      }).to.not.throwException();

      expect(array).to.eql(['A', 'B', 'C', 'D']);
    });

    it('Counter map unique asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).unique().asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql(['a']);
    });

    it('Counter map filter unique asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).filter(function () {
          return true;
        }).unique().asArray();
      }).to.not.throwException();

      expect(array).to.eql(['a']);
    });

    it('Counter then undefined', function () {
      var index = 0,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then();
      }).to.not.throwException();

      forOf(iterator, function (entry) {
        expect(index).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter then aGenerator', function () {
      var index = 0,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then(aGenerator);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      forOf(iterator, function (entry) {
        expect(index).to.be.within(0, 10);
        expect(entry).to.be(index * 2);
        index += 1;
      });
    });

    it('Counter then asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator).asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql([0, 2, 4, 6]);
    });

    it('Counter then map asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator, 2)
          .map(function (value) {
            return value * 2;
          }).asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql([4, 8, 12, 16]);
    });

    it('Counter then filter asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator, 1)
          .filter(function (value) {
            return value >= 3 && value <= 5;
          }).asArray();
      }).to.not.throwException();

      expect(array).to.eql([3, 5]);
    });

    it('Counter using sugar', function () {
      var index = 0;

      // forward
      forOf(reiterate().from(0).to(10).by(1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate().from(-10).to(0).by(2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate().from(10).to(-20).by(3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate().from(-20).to(-10).by(2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate().from(0).to(10).by(1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(10).to(0).by(2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate().from(0).to(-10).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter tap', function () {
      var index = 10,
        array;

      expect(function () {
        forOf(reiterate().tap(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      array = reiterate().from(10).to(20).tap(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      }).asArray();

      expect(array).to.eql([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      index = 10;
      reiterate().from(10).to(20).tap(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      }, true);

      // reverse
      index = 20;
      array = reiterate().from(10).to(20).reverse().tap(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      }).asArray();

      expect(array).to.eql([20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10]);
      index = 20;
      reiterate().from(10).to(20).reverse().tap(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      }, true);
    });

    it('Counter reduce', function () {
      var index = 10,
        r;

      expect(function () {
        forOf(reiterate().reduce(), function () {
          return true;
        });
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
      r = reiterate().from(10).to(20).reduce(
        function (acc, entry) {
          expect(acc).to.be.an('array');
          expect(entry).to.be.within(10, 20);
          expect(entry).to.be(index);
          index += 1;
          acc.push(entry);
          return acc;
        }, []
      );

      expect(r).to.eql(reiterate().from(10).to(20).asArray());

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
      r = reiterate().to(20).reverse().reduce(
        function (acc, entry) {
          expect(acc).to.be.a('number');
          expect(entry).to.be.within(0, 19);
          expect(entry).to.be(index);
          index -= 1;
          return acc + entry;
        }
      );

      expect(r).to.be(210);
    }, 0);

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

      gen = reiterate().from(-Infinity).to(Infinity).by(Infinity);
      state = gen.state();

      expect(state).to.eql({
        reversed: false,
        from: Number.MIN_SAFE_INTEGER,
        to: Number.MAX_SAFE_INTEGER,
        by: Number.MAX_SAFE_INTEGER
      });
    });
  });
}());
