module.exports = function (node, nodeStyle) {
    let dom = node.el;
    if (dom.fixedRadius) {
        nodeStyle.borderRadius = dom.fixedRadius;
    }
    return nodeStyle;
}
