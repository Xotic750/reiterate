Master

[![Build Status](https://travis-ci.org/Xotic750/reiterate.png?branch=master)](https://travis-ci.org/Xotic750/reiterate  "Build Status on Travis CI")

[![Dependency Status](https://david-dm.org/Xotic750/reiterate.png)](https://david-dm.org/Xotic750/reiterate#info=dependencies&view=table "Dependency Status on David")

[![Dev Dependency Status](https://david-dm.org/Xotic750/reiterate/dev-status.png)](https://david-dm.org/Xotic750/reiterate#info=devDependencies&view=table "Dev Dependency Status on David")

[![Coverage Status](https://coveralls.io/repos/Xotic750/reiterate/badge.svg?branch=master)](https://coveralls.io/r/Xotic750/reiterate?branch=master "Coverage status on Coveralls")

[![NPM version](https://badge.fury.io/js/reiterate.png)](http://badge.fury.io/js/reiterate "Current NPM release")

#[reiterate 0.1.0](http://xotic750.github.io/reiterate/) #
###### Xotic750 <Xotic750@gmail.com>

A modern iteration library.

## Load

The library is the single JavaScript file *reiterate.js* (or *reiterate.min.js*, which is *reiterate.js* minified).

It can be loaded via a script tag in an HTML document for the browser

    <script src='./relative/path/to/reiterate.js'></script>

or as a CommonJS, [Node.js](http://nodejs.org) or AMD module using `require`.

For Node, put the *reiterate.js* file into the same directory as the file that is requiring it and use

    var reiterate = require('./reiterate.js');

or put it in a *node_modules* directory within the directory and use `require('reiterate)`.

To load with AMD loader libraries such as [requireJS](http://requirejs.org/):

    require(['reiterate'], function(reiterate) {
        // Use reiterate here in local scope. No global reiterate.
    });

## Test

The *test* directory contains the test scripts for reiterate.

The tests can be run with Node.

To test all the methods

    $ npm test

## Build

I.e. minify.

On command line

    $ npm run-script minify

will create lib/*reiterate.min.js* from lib/*reiterate.js*.

[Test your browser](https://rawgit.com/Xotic750/reiterate/master/tests/browser/tests.html)

## Feedback

Feedback is welcome.

## Licence

See LICENCE.
