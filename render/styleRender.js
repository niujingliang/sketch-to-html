const path = require('path');
const Layer = require('../layer/LayerFactory');
const SymbolStore = require('../store/SymbolStore');

const styleRender = function (layer, parentLayer, imagePath = '', selector = '') {
    if (!layer.isVisible) {
        return '';
    }

    if (layer.type == 'symbolInstance') {
        layer.childrens = SymbolStore.get(layer.symbolID)?.childrens;
    }
    selector = selector + '.' + layer.name + ' ';

    let layerInstance = new Layer();
    layerInstance.layer = layer;
    layerInstance.parentLayer = parentLayer;
    layerInstance.imagePath = imagePath;
    layerInstance.selector = selector;
    layer.finalStyle = layerInstance.getStyle();
    if (layer.isMask) {
        // 如果当前是一个遮罩，给其父元素一个 mask-image ，并将此layer的frame赋值给父元素。
        if (layer.style.linearGradientString) {
            parentLayer.finalStyle['background'] = layer.style.linearGradientString;
        }
        if (layer.style.backgroundImage) {
            parentLayer.finalStyle['background'] = `image(url(${path.join(imagePath, layer.style.backgroundImage)}))`;
        }
        if(layer.finalStyle.width) {
            parentLayer.finalStyle.width = layer.finalStyle.width;
            parentLayer.finalStyle.overflow = 'hidden';
        }
        if(layer.finalStyle.height) {
            parentLayer.finalStyle.height = layer.finalStyle.height;
            parentLayer.finalStyle.overflow = 'hidden';
        }
    }
    layer.childrens && layer.childrens.forEach((child) => {
        styleRender(child, layer, imagePath, selector);
    });
};

module.exports = styleRender;
