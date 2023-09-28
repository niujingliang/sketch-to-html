module.exports = function (node) {
    if(node.frame) {
        node.frame.x = null;
        node.frame.y = null;
    }
    return node;
}