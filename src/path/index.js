const util = require('../utils')

function toS(a) {
    return Number(a).toFixed(6).replace(/\.?0+$/, '');
}

module.exports = function pathParser(node) {
    const dom = node.el;
    if(!dom) return null;

    const { points, isClosed } = dom;
    if (!points || !points.length) {
        return null;
    }

    let { x, y } = util.toPoint(points[0].point, dom);
    let ret = `M${toS(x)},${toS(y)}`;
    let n = isClosed ? points.length + 1 : points.length;
    for (let i = 1; i < n; ++i) {
        let now = i;
        if (now === points.length) {
            now = 0;
        }
        let prev = (i - 1);
        let { x: x1, y: y1 } = util.toPoint(points[prev].curveFrom, dom);
        let { x: x2, y: y2 } = util.toPoint(points[now].curveTo, dom);
        let { x, y } = util.toPoint(points[now].point, dom);
        if (!points[now].hasCurveTo && !points[now].hasCurveFrom) {
            ret += `L${toS(x)},${toS(y)}`;
        } else {
            ret += `C${toS(x1)},${toS(y1)} ${toS(x2)},${toS(y2)} ${toS(x)},${toS(y)}`;
        }
    }

    if (isClosed) {
        ret += 'Z';
    }
    return ret;
}
