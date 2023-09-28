const util = require('../utils');

module.exports = function (node) {
    const element = node.el;
    if(!util.isCircle(element)) {
        node.type = 'shapePath';
    } else {
        const points = element.path ? element.path.points : element.points;
        const p1 = util.toPoint(points[0].point, element);
        const p2 = util.toPoint(points[1].point, element);
        const p3 = util.toPoint(points[2].point, element);
        const p4 = util.toPoint(points[3].point, element);
        node.style.borderRadius = (p1.y - p3.y) / 2;
    }
    return node;
}