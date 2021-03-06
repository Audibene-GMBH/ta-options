"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = wait;
exports.start = exports.next = exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  runs test functions in a sequence in spite of jest's asynchronousity, use sparingly
  useful for singletons and external libraries or any external thing where the state can be affected by concurrent tests

  usage:

    import {next,start} from 'NextTest'

    test('first test',async () => {
        await next(() => {
            // test code goes here
        })
    } )

    test('second test',async () => {
        await next(() => {
            // test code goes here
        })
    } )

    test('last test',async () => {
        await next(() => {
            // test code goes here
        })
    } )

    start() // runs them in sequence

  */
function wait(milliseconds) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, milliseconds);
  });
}

var NextTest = /*#__PURE__*/function () {
  function NextTest() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, NextTest);

    this.ms = ms;
    this.count = 0; // total tests

    this.index = 0; // current test
  }

  _createClass(NextTest, [{
    key: "doNext",
    value: function () {
      var _doNext = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(func, ms) {
        var count;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ms = ms || this.ms;
                count = ++this.count;

              case 2:
                if (!(this.index < count)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 5;
                return wait(ms);

              case 5:
                _context.next = 2;
                break;

              case 7:
                // surrender this thread
                this.index++;
                return _context.abrupt("return", func());

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function doNext(_x, _x2) {
        return _doNext.apply(this, arguments);
      }

      return doNext;
    }()
  }, {
    key: "start",
    value: function start() {
      this.index++;
    } // starts the queue

  }]);

  return NextTest;
}(); // copy this code into your block if you want to avoid collisions with other sequential tests


exports["default"] = NextTest;
var me = new NextTest(); // singleton

var next = me.doNext;
exports.next = next;
var start = me.start;
exports.start = start;