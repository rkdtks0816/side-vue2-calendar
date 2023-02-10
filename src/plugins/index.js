import Utils from './utils/index';

export default {
    install(Vue) {
        Vue.prototype.$Utils = Utils;
    }
}