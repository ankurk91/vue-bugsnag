'use strict';
const Bugsnag = window.Bugsnag || require('bugsnag-js');

/**
 * Extract component name from vm
 *
 * @param vm
 * @returns String
 */
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

/**
 * Hook into Vue.js error handler
 *
 * @param Vue Vue.js instance
 * @param params Object|String
 */
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

    // Lastly call original handler if registered
    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm, info);
    }
  };
}

export default plugin;
