module.exports = function (node, element) {
    node.text = node.style.text || node?.el?.name;
    return node;
}