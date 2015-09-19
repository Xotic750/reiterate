Master

[![Build Status](https://travis-ci.org/Xotic750/@@MODULE.png?branch=master)](https://travis-ci.org/Xotic750/@@MODULE  "Build Status on Travis CI")

[![Dependency Status](https://david-dm.org/Xotic750/@@MODULE.png)](https://david-dm.org/Xotic750/@@MODULE#info=dependencies&view=table "Dependency Status on David")

[![Dev Dependency Status](https://david-dm.org/Xotic750/@@MODULE/dev-status.png)](https://david-dm.org/Xotic750/@@MODULE#info=devDependencies&view=table "Dev Dependency Status on David")

[![Coverage Status](https://coveralls.io/repos/Xotic750/@@MODULE/badge.svg?branch=master)](https://coveralls.io/r/Xotic750/@@MODULE?branch=master "Coverage status on Coveralls")

[![NPM version](https://badge.fury.io/js/@@MODULE.png)](http://badge.fury.io/js/@@MODULE "Current NPM release")

#[@@MODULE @@VERSION](@@HOMEPAGE) #
###### @@AUTHORNAME <@@AUTHOREMAIL>

@@DESCRIPTION

## Load

The library is the single JavaScript file *@@MODULE.js* (or *@@MODULE.min.js*, which is *@@MODULE.js* minified).

It can be loaded via a script tag in an HTML document for the browser

    <script src='./relative/path/to/@@MODULE.js'></script>

or as a CommonJS, [Node.js](http://nodejs.org) or AMD module using `require`.

For Node, put the *@@MODULE.js* file into the same directory as the file that is requiring it and use

    var @@MODULE = require('./@@MODULE.js');

or put it in a *node_modules* directory within the directory and use `require('@@MODULE)`.

To load with AMD loader libraries such as [requireJS](http://requirejs.org/):

    require(['@@MODULE'], function(@@MODULE) {
        // Use @@MODULE here in local scope. No global @@MODULE.
    });

## Test

The *test* directory contains the test scripts for @@MODULE.

The tests can be run with Node.

To test all the methods

    $ node test

## Build

I.e. minify.

On command line

    $ npm run-script minify

will create lib/*@@MODULE.min.js* from lib/*@@MODULE.js*.

## Feedback

[Test your browser](https://rawgit.com/Xotic750/reiterate/master/tests/browser/tests.html)

Feedback is welcome.

## Licence

See LICENCE.
