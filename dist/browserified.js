(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_timerlib', require('./index')(ALLEX));

},{"./index":2}],2:[function(require,module,exports){
function createLib (execlib) {
  return {
    Timer: require('./timercreator')(execlib)
  };
}

module.exports = createLib;

},{"./timercreator":3}],3:[function(require,module,exports){
function createTimer (execlib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q;

  function TheTimer (func, period, initialtrigger) {
    this.func = func;
    this.period = period;
    this.periodic = true;
    this.target = 0;
    this.goer = this.go.bind(this);
    this.timeout = null;
    if (period < 0) {
      this.period = -period;
      this.periodic = false;
    }
    if (initialtrigger) {
      this.func();
    }
    this.set();
  }
  TheTimer.prototype.destroy = function () {
    if (this.timeout) {
      lib.clearTimeout(this.timeout);
    }
    this.timeout = null;
    this.goer = null;
    this.target = null;
    this.periodic = null;
    this.period = null;
    this.func = null;
  };
  TheTimer.prototype.set = function () {
    var nextperiod;
    if (!this.func) {
      this.destroy();
      return;
    }
    if (this.target) {
      this.target += this.period;
    } else {
      this.target = Date.now()+this.period;
    }
    nextperiod = this.target-Date.now();
    if (nextperiod<1) {
      this.timeout = lib.runNext(this.goer);
    } else {
      this.timeout = lib.runNext(this.goer, nextperiod);
    }
  };
  TheTimer.prototype.go = function () {
    this.timeout = null;
    if (!this.func) {
      this.destroy();
      return;
    }
    this.func();
    if (this.periodic) {
      this.set();
    } else {
      this.destroy();
    }
  };
  TheTimer.prototype.reset = function () {
    if (this.timeout) {
      lib.clearTimeout(this.timeout);
    }
    this.target = null;
    this.set();
  };

  return TheTimer;
}

module.exports = createTimer;

},{}]},{},[1]);
