'use strict';
const Bugsnag = window.Bugsnag || require('bugsnag-js');

function formatComponentName(vm) {
  if (vm.$root === vm) {
    return 'root instance'
  }
  let name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
}

function plugin(Vue, params) {

  // Preserve old handler
  let _oldOnError = Vue.config.errorHandler;

  // https://vuejs.org/v2/api/#errorHandler
  Vue.config.errorHandler = function VueErrorHandler(error, vm, info) {

    // https://docs.bugsnag.com/platforms/browsers/#custom-diagnostics
    let metaData = {
      componentName: formatComponentName(vm),
      propsData: vm.$options.propsData,
      lifeCycleHook: info // Vue.js v2.2.0+
    };

    console.info(metaData);

    Bugsnag.notifyException(error, {
      vue: metaData
    });

    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm);
    }
  };
}

export default plugin;
