const util = require('../utils');

const patch = {
    rectangle : require('./elements/rectangle.js'),
}
const styles = {
    border: require('./border.js'),
    font: require('./font.js'),
    fill: require('./fill.js'),
}

module.exports = function styleParser(node) {
    let nodeStyle = {};

    let dom = node.el;
    if(!dom) return nodeStyle;

    // 旋转缩放
    if(dom.isFlippedHorizontal || dom.isFlippedVertical || dom.rotation || dom.scale) {
        nodeStyle.transform = nodeStyle.transform || [];

        if (dom.isFlippedHorizontal) {
            nodeStyle.transform.push('rotateY(180deg)');
        }
        if (dom.isFlippedVertical) {
            nodeStyle.transform.push('rotateX(180deg)');
        }
        if (dom.rotation) {
            nodeStyle.transform.push(`rotate(${-1 * dom.rotation}deg)`);
        }
        if(dom.scale) {
            nodeStyle.transform.push(`scale(${dom.scale})`);
            nodeStyle.transformOrigin = '0 0';
        }
    }

    // 背景色
    if (dom.hasBackgroundColor && dom.backgroundColor) {
        nodeStyle.backgroundColor = util.color(dom.backgroundColor);
    }


    let { style = {} } = dom;

    // 透明度
    if (style.contextSettings) {
        nodeStyle.opacity = style.contextSettings.opacity;
    }

    // 阴影
    let shadows = style.shadows || [];
    shadows.forEach((shadow) => {
        if(!shadow.isEnabled) return;

        nodeStyle.boxShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${util.color(shadow.color)}`;
    });

    // 处理边框
    nodeStyle = styles.border(node, nodeStyle);
    // 处理字体+颜色
    nodeStyle = styles.font(node, nodeStyle);
    // 填充色（填充色某些情况下用于背景色，某些情况下用户子元素的填充色，依情况render时再区分具体的使用）
    nodeStyle = styles.fill(node, nodeStyle);

    // 不同类型的组件不同的样式处理
    if(patch[node.type]) {
        nodeStyle = patch[node.type](node, nodeStyle);
    }

    return nodeStyle;
}
