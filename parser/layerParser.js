const util = require('./../util.js');
const SymbolStore = require('./../store/SymbolStore');
const styleParser = require('./styleParser');
const pathParser = require('./pathParser');
const pinyin = require('node-pinyin');

const nameStore = [];

const rename = function (name) {
    let index = 1;
    let nextName = name;

    while (nameStore.indexOf(nextName) !== -1) {
        nextName = name + '_' + (index++);
    }
    return nextName;
};

const parseElement = function (element, parentNode) {
    let vnode = {};
    vnode.id = element.do_objectID;
    vnode.frame = element.frame || {};
    vnode.style = styleParser(element.style, element.attributedString, element);
    vnode.path = pathParser(element);
    vnode.isVisible = element.isVisible;
    vnode.parentNode = parentNode;

    let name = element.name ? element.name : '未命名';
    name = name.replace(/[\u4e00-\u9fa5]*/, function (m) {
        return pinyin(m, {
            style: 'normal'
        });
    }).replace(/^([^a-z_A-Z])/, '_$1').replace(/[^a-z_A-Z0-9-]/g, '_');
    vnode.name = rename(name);
    nameStore.push(vnode.name);

    vnode.type = element._class;
    if (element._class === 'oval') {
        vnode.isCircle = util.isCircle(element);
        if (vnode.isCircle) {
            const points = element.path ? element.path.points : element.points;
            const p1 = util.toPoint(points[0].point, element);
            const p2 = util.toPoint(points[1].point, element);
            const p3 = util.toPoint(points[2].point, element);
            const p4 = util.toPoint(points[3].point, element);
            vnode.style.borderRadius = (p1.y - p3.y) / 2;
        }
    }
    vnode.isMask = !!element.hasClippingMask;
    if (element._class === 'rectangle') {
        vnode.isRect = util.isRect(element);
    }
    if (element._class === 'text') {
        vnode.text = vnode.style.text || element.name;
    }
    if (element._class === 'bitmap') {
        vnode.image = element.image._ref + '.png';
    }
    if (element._class === 'artboard') {
        vnode.frame.x = null;
        vnode.frame.y = null;
    }
    if (element.symbolID) {
        vnode.symbolID = element.symbolID;
    }
    return vnode;
};

const layerParser = function (page, parentNode = null) {
    let element = {};
    element = parseElement(page, parentNode);
    if (page.layers) {
        element.childrens = [];
        page.layers.forEach((_item) => {
            let r = layerParser(_item, element);
            if (r) {
                element.childrens.push(r);
            }
        });
    }
    if (element.type === 'symbolMaster') {
        SymbolStore.set(element.symbolID, element);
    }
    console.log(element.id);
    if(element.id === '62807D14-CBF8-4BE8-BD05-D515EC8D036C') {
        console.log(element);
    }
    return element;
};

module.exports = layerParser;