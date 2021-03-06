"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.theOptions = exports.Options = void 0;

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
  I'm calling this "Options", since featureflags is taken
  the goal is to develop an agnostic approach that is not dependent on react, redux, etc.

  It should allow the developer to specify options (flags) in multiple ways...
    first they can be initialized in config.options
    but those can be overloaded by process.env
    and then overloaded by sessionStorage (prior changes)
    and then overloaded by a querystring (in case we want to overload it now, dynamically)
    and all can be changed dynamically in the code and gui (logic trumps all)
    and you can extend this object to include remote options, like launchdarkly feature flags, etc.
    
  Usage... http://hear.com?options=flag1,-flag2,+flag3&flag4=four would turn flag1 On (true), and flag2 and flag3 Off (false)

  options will look something like {
      flag1: true,
      flag2: false,
      flag3: true,
      flag4: 'four',
  }
  
*/
var globalThis = window || global;

var Options = /*#__PURE__*/function () {
  function Options() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Options);

    this.config = _objectSpread(_objectSpread({}, this.config), props.config);
    this.init(props);
    this.config = {
      options: {}
    };
    this.callbacks = [];
  }

  _createClass(Options, [{
    key: "init",
    value: function init() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var priorUpdates = this.read();
      this.write(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, this.config.options), process.env), props), priorUpdates));
      this.addQueryString();
    }
  }, {
    key: "set",
    value: function set(options) {
      this.list = options || {};
    }
  }, {
    key: "update",
    value: function update(options) {
      var _this = this;

      this.write(_objectSpread(_objectSpread({}, this.list), options));
      this.callbacks.forEach(function (func) {
        func(_this.list);
      });
    }
  }, {
    key: "onChange",
    value: function onChange(func) {
      if (typeof func !== "function") return;
      if (this.callbacks.indexOf(func) > -1) return;
      this.callbacks.push(func);
    }
  }, {
    key: "write",
    value: function write(options) {
      this.list = options || this.list;
      if (!this.list) return;
      if (globalThis.sessionStorage) globalThis.sessionStorage.setItem("options", JSON.stringify(this.list));else globalThis.options = this.list;
    }
  }, {
    key: "read",
    value: function read() {
      try {
        var _globalThis$sessionSt;

        var temp = (_globalThis$sessionSt = globalThis.sessionStorage) === null || _globalThis$sessionSt === void 0 ? void 0 : _globalThis$sessionSt.getItem("options");
        if (temp) temp = JSON.parse(temp);
        this.list = temp || globalThis.options || this.list || {};
        return this.list;
      } catch (_unused) {
        return globalThis.options || this.list || {};
      }
    }
  }, {
    key: "addQueryString",
    value: function addQueryString(qs) {
      var _window$location;

      if (this.list.addQueryString === false) return;
      qs = qs || ((_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.search);
      if (qs[0] === "?") qs = qs.slice(1);

      var params = _querystring["default"].parse(qs); // parse the options param


      if (params.options) {
        var list = params.options;
        if (!Array.isArray(list)) list = [list]; // ensure list is an array

        list.forEach(function (options) {
          options.split(",").forEach(function (word) {
            word = word.trim();

            if (word[0] === "-") {
              params[word.slice(1)] = false;
            } else if (word[0] === "+") {
              params[word.slice(1)] = true;
            } else params[word] = true;
          });
        });
        delete params.options;
      } // deduplicate params aka an array per param


      Object.keys(params).forEach(function (key) {
        var p = params[key];
        if (Array.isArray(p)) params[key] = p[p.length - 1]; // retain the last one only
      });
      this.update(params);
    }
  }]);

  return Options;
}();

exports.Options = Options;
var theOptions = new Options(); // singleton

exports.theOptions = theOptions;
var _default = theOptions;
exports["default"] = _default;