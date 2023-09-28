const util = require('../utils');

module.exports = function (node) {
    // 如果不是规则矩形，转换成shapePath
    if(!util.isRect(node.el)) {
        node.type = 'shapePath';
    }
    return node;
}