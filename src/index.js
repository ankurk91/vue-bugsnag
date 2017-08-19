import VueBugsnag from './vue-bugsnag';

let plugin = {
  install: VueBugsnag
};

//  Auto initialization
if (typeof window !== 'undefined') {
  window.Vue && Vue.use(plugin);
}

export default plugin;
