import utils from './utils/index';

export default {
    install(Vue) {
        Vue.prototype.$utils = utils;
    }
}