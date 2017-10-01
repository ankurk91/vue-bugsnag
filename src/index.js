import VueBugsnag from './vue-bugsnag';

//  Auto initialization
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueBugsnag);
}

export default VueBugsnag;
