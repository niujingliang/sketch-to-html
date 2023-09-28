module.exports = function (node) {
    node.image = node.el.image._ref + '.png';
    return node;
}