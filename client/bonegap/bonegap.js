var mod = {};

if(typeof(module.exports) !== 'undefined'){
  module.exports = mod;
} else if(typeof(define) !== 'undefined' && typeof(define.amd) === 'function'){
  define(mod);
} else {
  window.Bonegap = mod;
}
