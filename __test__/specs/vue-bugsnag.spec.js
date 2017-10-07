import Plugin from '../../src/vue-bugsnag';
import Bugsnag from 'bugsnag-js';
// Lets import full build
import Vue from 'vue/dist/vue.common';

describe('VueBugsnag', () => {

  // Init with fake API key
  Bugsnag.apiKey = '0'.repeat(32);

  // Set our own errorHandler
  // This needs to bet setup before plugin initialization
  Vue.config.errorHandler = (...args) => {
    // owner handler
  };

  // Init plugin
  Vue.use(Plugin);

  test('capture lifecycle hook errors', () => {
    let spy = jest.spyOn(Bugsnag, 'notifyException');

    let error = new Error('Error in mounted hook.');
    let app = Vue.extend({
      template: `<div id="app">
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
    expect(spy).toBeCalled();
    expect(spy.mock.calls[0][0]).toEqual(error);
    expect(spy.mock.calls[0][1].vue.lifecycleHook).toEqual('mounted hook');

    wrapper.$destroy();
    spy.mockReset();
  });

  test('calls existing error handler', () => {
    let spy = jest.spyOn(Vue.config, 'errorHandler');

    let error = new Error('Yet another error.');
    let app = Vue.extend({
      template: `<div id="another-app">
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
    expect(spy).toBeCalled();
    expect(spy.mock.calls[0][0]).toEqual(error);
    expect(spy.mock.calls[0][1]).toEqual(wrapper);
    expect(spy.mock.calls[0][2]).toEqual('mounted hook');

    wrapper.$destroy();
    spy.mockReset();
  });

});
