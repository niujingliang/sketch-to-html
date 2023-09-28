const util = require("../utils");

module.exports = function(node, nodeStyle) {
    const dom = node.el;
    if(!dom) return nodeStyle

    let { style = {} } = dom;

    let fills = style.fills || [];
    fills.forEach((fill) => {
        if (!fill.isEnabled) return;

        if (fill.image) {
            nodeStyle.fillImage = `url(${ fill.image._ref }.png)`;
        }

        // 渐变填充
        if(fill.fillType === 1) {
            let gradient = fill.gradient;
            nodeStyle.fillImage = util.getGradientStyle(gradient)
        }
        if(!nodeStyle.fillImage) {
            nodeStyle.fillColor = util.color(fill.color);
        }
    });

    return nodeStyle;
}
