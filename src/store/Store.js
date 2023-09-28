/**
 * 简易缓存
 */
class Store {
    constructor() {
        this.data = {};
    }

    set (key, value) {
        this.data[key] = value;
    }

    get (key) {
        return this.data[key];
    }

    remove(key) {
        delete this.data[key];
    }

    reset() {
        this.data = {};
    }
}

module.exports = Store;