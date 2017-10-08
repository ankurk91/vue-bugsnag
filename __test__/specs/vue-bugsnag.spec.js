import Plugin from '../../src/vue-bugsnag';
import Bugsnag from 'bugsnag-js';
// Lets import full build
import Vue from 'vue/dist/vue.common';

describe('VueBugsnag', () => {

  // Init with fake API key
  Bugsnag.apiKey = '0'.repeat(32);

  // Only manual error reporting allowed during tests
  Bugsnag.autoNotify = false;

  // Set our own errorHandler
  // This needs to bet setup before plugin initialization
  Vue.config.errorHandler = (...args) => {
    // owner handler
  };

  // Init plugin
  Vue.use(Plugin);

  afterEach(() => {
    Bugsnag.refresh();
  });

  test('captures lifecycle hook errors', () => {
    let spy = jest.spyOn(Bugsnag, 'notifyException');

    let error = new Error('Error in mounted hook.');
    let app = Vue.extend({
      template: `<div id="app1">
                  <h1>Hello</h1>
                 </div>`,
      data() {
        return {for: 'bar'}
      },
      mounted() {
        throw error
      }
    });

    let wrapper = new app().$mount();
    expect(spy).toBeCalledWith(error, {
      vue: {
        component: 'root instance',
        props: undefined,
        lifecycleHook: 'mounted hook'
      }
    });

    wrapper.$destroy();
    spy.mockRestore();
  });

  test('calls existing error handler', () => {
    let spy = jest.spyOn(Vue.config, 'errorHandler');

    let error = new Error('Yet another error.');
    let app = Vue.extend({
      template: `<div id="app2">
                  <h1>Hello Vue</h1>
                 </div>`,
      data() {
        return {for: 'bar'}
      },
      mounted() {
        throw error
      }
    });

    let wrapper = new app().$mount();
    expect(spy).toBeCalledWith(error, wrapper, 'mounted hook');

    wrapper.$destroy();
    spy.mockRestore();
  });


  test('captures component name', () => {
    let spy = jest.spyOn(Bugsnag, 'notifyException');
    let error = new Error('Error from child.');

    let app = Vue.extend({
      template: `<div id="app3">
                  <fancy-button :label="label"></fancy-button>
                 </div>`,
      data() {
        return {
          label: 'Click me'
        }
      },
      components: {
        fancyButton: {
          props: {
            label: {
              type: String
            }
          },
          template: `<button>{{label}}</button>`,
          mounted() {
            throw error
          },
        }
      }
    });

    let wrapper = new app().$mount();

    expect(spy).toBeCalledWith(error, {
      vue: {
        component: 'component <fancy-button>',
        props: {label: 'Click me'},
        lifecycleHook: 'mounted hook'
      }
    });

    wrapper.$destroy();
    spy.mockRestore();
  });

});
