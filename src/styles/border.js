const util = require("../utils");

module.exports = function(node, nodeStyle) {
    const dom = node.el;
    if(!dom) return nodeStyle;

    const { style = {} } = dom;
    const borders = style.borders || [];
    borders.forEach((border) => {
        if(!border.isEnabled) return;

        if (node.type == 'text') {
            nodeStyle.textStrokeWidth = border.thickness;
            nodeStyle.textStrokeColor = util.color(border.color);
            return;
        } 

        nodeStyle.borderWidth = border.thickness;
        nodeStyle.borderStyle = 'solid';
        nodeStyle.borderPosition = border.position;

        // 渐变填充
        if(border.fillType === 1) {
            let gradient = border.gradient;
            nodeStyle.borderImage = util.getGradientStyle(gradient)
            if(!nodeStyle.borderImage) {
                nodeStyle.borderColor = util.color(border.color);
            }
        } else {
            nodeStyle.borderColor = util.color(border.color);
        }
    });

    return nodeStyle;
}