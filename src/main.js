import './set-public-path';
import Vue from 'vue';
import Router from 'vue-router';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routerMap from './router';
import store from './store';
import singleSpaVue from 'single-spa-vue';
import QuRequest from '@/core/QuRequest';
import util from '@/common/js/util';
import mapi from './assets/js/mock';


Vue.use(ElementUI);
Vue.use(Router);
Vue.prototype.$api = new QuRequest()
Vue.prototype.$mapi = mapi
Vue.prototype.$util = util

const router = new Router(routerMap);

if (BUILD_HOT) {
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
}

Vue.config.productionTip = false;
const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        router,
        store,
        render: h => h(App)
    }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
