# Vue Bugsnag

[![vue-js](https://img.shields.io/badge/vue.js-2.x-brightgreen.svg?maxAge=604800)](https://vuejs.org/)
[![downloads](https://img.shields.io/npm/dt/vue-bugsnag.svg)](http://npm-stats.com/~packages/vue-bugsnag)
[![npm-version](https://img.shields.io/npm/v/vue-bugsnag.svg)](https://www.npmjs.com/package/vue-bugsnag)
[![github-tag](https://img.shields.io/github/tag/ankurk91/vue-bugsnag.svg?maxAge=1800)](https://github.com/ankurk91/vue-bugsnag/)
[![license](https://img.shields.io/github/license/ankurk91/vue-bugsnag.svg?maxAge=1800)](https://yarnpkg.com/en/package/vue-bugsnag)
[![build-status](https://travis-ci.org/ankurk91/vue-bugsnag.svg?branch=master)](https://travis-ci.org/ankurk91/vue-bugsnag)
[![codecov](https://codecov.io/gh/ankurk91/vue-bugsnag/branch/master/graph/badge.svg)](https://codecov.io/gh/ankurk91/vue-bugsnag)

Vue.js plugin for [bugsnag-js](https://github.com/bugsnag/bugsnag-js) error reporting

![Bugsnag Dashboard](screenshot.png)

## Installation
```bash
# npm
npm install vue-bugsnag --save

# Yarn
yarn add vue-bugsnag
```

## Usage
* Grab your API key from [Bugsnag](https://www.bugsnag.com/)
```js
import Bugsnag from 'bugsnag-js';
Bugsnag.apiKey = 'YOUR-API-KEY-HERE';
```
* Plug into Vue.js
```js
import Vue from 'vue';
import VueBugsnag from 'vue-bugsnag';
Vue.use(VueBugsnag);
```
* Prevent Bugsnag from being initialized in development
```js
if (process.env.NODE_ENV === 'production') {
  // Initialize Bugsnag here
}
```
* Limit error reporting to specific release [stages](https://docs.bugsnag.com/platforms/browsers/configuration-options/#releasestage)
```js
Bugsnag.releaseStage = 'YOUR-CURRENT-ENVIRONMENT';
Bugsnag.notifyReleaseStages = ['staging', 'production'];
```

## Use with Vue Router
* Use the global `afterEach` [navigation guard](https://router.vuejs.org/en/advanced/navigation-guards.html#global-after-hooks) to reset the Bugsnag error [rate limit](https://docs.bugsnag.com/platforms/browsers/configuration-options/#refresh).
```js
router.afterEach((to, from) => {
    Bugsnag.refresh();
});
```

## Laravel Mix user?
Checkout [this](https://github.com/ankurk91/vue-bugsnag/wiki/Laravel-Mix) guide

## Use in browser (without webpack)
* Include required files
```html
<!-- Add Bugsnag core library -->
<script src="//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js"
        data-apikey="YOUR-API-KEY-HERE"></script>
<!-- Vue js -->
<script src="https://unpkg.com/vue@2.4.4/dist/vue.min.js"></script>
<!-- Lastly add this package -->
<script src="https://unpkg.com/vue-bugsnag"></script>
```
* That's it, plugin will auto initialize.

## How does it work?
* This plugin utilize Vue.js inbuilt [error handler](https://vuejs.org/v2/api/#errorHandler)
* This plugin prepares a payload and send this to Bugsnag as [metadata](https://docs.bugsnag.com/platforms/browsers/#custom-diagnostics)
* This metadata will appear on a new tab in Bugsnag dashboard.

### Credits and Thanks
* Thanks to Sentry for their [Vue.js plugin](https://github.com/getsentry/raven-js)

### Resources
* [Bugsnag Browser integration guide](https://docs.bugsnag.com/platforms/browsers/) 

### License
[MIT](LICENSE.txt) License
