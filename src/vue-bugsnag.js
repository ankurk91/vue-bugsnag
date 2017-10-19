const Bugsnag = window.Bugsnag || require('bugsnag-js');

// Helpers for formatComponentName method
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = str => str
  .replace(classifyRE, c => c.toUpperCase())
  .replace(/[-_]/g, '');

/**
 * Extract component name (and file) from vm
 * This method has been taken from file -
 * https://github.com/vuejs/vue/blob/dev/src/core/util/debug.js
 *
 * @param vm
 * @param includeFile boolean
 * @returns String
 */
const formatComponentName = (vm, includeFile) => {
  if (vm.$root === vm) {
    return '<Root>'
  }
  const options = typeof vm === 'function' && vm.cid !== null
    ? vm.options
    : vm._isVue
      ? vm.$options || vm.constructor.options
      : vm || {};
  let name = options.name || options._componentTag;
  const file = options.__file;
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    name = match && match[1]
  }

  return (
    (name ? `<${classify(name)}>` : `<Anonymous>`) +
    (file && includeFile !== false ? ` at ${file}` : '')
  )
};


/**
 * Hook into Vue.js error handler
 *
 * @param Vue Vue.js instance
 * @param params Object|String
 */
const VueBugsnag = (Vue, params) => {

  // Quit if not a Vue constructor
  /* istanbul ignore if */
  if (!Vue.config) return;

  // Preserve old handler
  let _oldOnError = Vue.config.errorHandler;

  // https://vuejs.org/v2/api/#errorHandler
  Vue.config.errorHandler = (error, vm, info) => {

    // https://docs.bugsnag.com/platforms/browsers/#custom-diagnostics
    let metaData = {
      component: formatComponentName(vm, true),
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
