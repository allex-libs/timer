function createTimer (execlib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q;

  function TheTimer (func, period, initialtrigger) {
    this.func = func;
    this.period = period;
    this.target = 0;
    this.goer = this.go.bind(this);
    this.timeout = null;
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
    this.set();
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
