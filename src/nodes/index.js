const pinyin = require('node-pinyin');
const Store = require('../store/Store');
const styleParser = require('../styles');
const pathParser = require('../path');

const patch = {
    artboard: require('./artboard.js'),
    bitmap: require('./bitmap.js'),
    text: require('./text.js'),
    rectangle: require('./rectangle.js'),
    oval: require('./oval.js'),
}

const nameStore = [];
const rename = function (name) {
    let index = 1;
    let nextName = name;

    while (nameStore.indexOf(nextName) !== -1) {
        nextName = name + '_' + (index++);
    }

    nameStore.push(nextName);
    return nextName;
};

function _createNode(element, parentNode) {
    let node = {};
    node.id = element.do_objectID;
    node.type = element._class;
    node.parentNode = parentNode;
    node.children = [];
    node.el = element;

    node.frame = element.frame || {};
    node.style = styleParser(node);
    node.path = pathParser(node);

    node.isVisible = element.isVisible;
    node.isMask = !!element.hasClippingMask;
    node.symbolID = element.symbolID;

    let name = element.name ? element.name : '未命名';
    name = name.replace(/[\u4e00-\u9fa5]*/, m => pinyin(m, { style: 'normal'}))
        .replace(/^([^a-z_A-Z])/, '_$1')
        .replace(/[^a-z_A-Z0-9-]/g, '_');
    node.name = rename(name);

    if(patch[node.type]) {
        node = patch[node.type](node);
    }

    return node;
}

// 模板缓存
const symbolMasterStore = new Store();
// 模板引用缓存
const symbolInstanceStore = new Store();

function createNode(dom, parentNode) {
    let node = _createNode(dom, parentNode);
    let layers = dom.layers || []
    layers.forEach((layer) => node.children.push(createNode(layer, node)));

    // 当前节点是个模板，其他地方可以引用这个模板
    if (node.type === 'symbolMaster') {
        const symbolID = node.symbolID;
        let nodes = symbolInstanceStore.get(symbolID) || [];
        symbolInstanceStore.remove(symbolID);
        nodes.forEach(n => {
            n.children = node.children;
        })

        symbolMasterStore.set(node.symbolID, node);
    } else if (node.type === 'symbolInstance') { // 模板的引用实例
        const symbolID = node.symbolID;
        let symbolMaster = symbolMasterStore.get(symbolID);
        if(symbolMaster) {
            node.children = symbolMaster.children;
        } else {
            let instances = symbolInstanceStore.get(symbolID) || []
            instances.push(node)
            symbolInstanceStore.set(symbolID, instances);
        }
    }
    return node;
}

module.exports = {
    createNode,
}
