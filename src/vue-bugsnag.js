const Bugsnag = window.Bugsnag || require('bugsnag-js');

/**
 * Extract component name from vm
 *
 * @param vm
 * @returns String
 */
const formatComponentName = (vm) => {
  if (vm.$root === vm) {
    return 'root instance'
  }
  let name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
};


/**
 * Hook into Vue.js error handler
 *
 * @param Vue Vue.js instance
 * @param params Object|String
 */
const VueBugsnag = (Vue, params) => {
  // Preserve old handler
  let _oldOnError = Vue.config.errorHandler;

  // https://vuejs.org/v2/api/#errorHandler
  Vue.config.errorHandler = (error, vm, info) => {

    // https://docs.bugsnag.com/platforms/browsers/#custom-diagnostics
    let metaData = {
      component: formatComponentName(vm),
      props: vm ? vm.$options.propsData : undefined,
      lifecycleHook: info // Vue.js v2.2.0+
    };

    Bugsnag.notifyException(error, {
      vue: metaData
    });

    // Lastly call original handler if registered
    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm, info);
    }
  };
};

export default VueBugsnag;
