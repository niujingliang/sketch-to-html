
/**
 * 生成 rgba 颜色值
 * @param color
 * @returns {string}
 */
function color(color) {
    let red = parseInt(color.red * 255);
    let green = parseInt(color.green * 255);
    let blue = parseInt(color.blue * 255);
    let alpha = color.alpha == undefined ? 1 : color.alpha;
    return `rgba(${red},${green},${blue},${alpha})`;
}

/**
 * 是否正方形
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns {boolean}
 */
function isSquare(p1, p2, p3, p4) {
    let distSq = (p, q) => {
        return (p.x - q.x) * (p.x - q.x) +
          (p.y - q.y) * (p.y - q.y);
    };
    let d2 = distSq(p1, p2);
    let d3 = distSq(p1, p3);
    let d4 = distSq(p1, p4);
    let s1 = distSq(p1, p2);
    let s2 = distSq(p2, p3);
    let s3 = distSq(p3, p4);
    let s4 = distSq(p4, p1);

    let allSidesSame = s1 === s2 && s2 === s3 && s3 === s4;
    // If lengths if (p1, p2) and (p1, p3) are same, then
    // following conditions must met to form a square.
    // 1) Square of length of (p1, p4) is same as twice
    //    the square of (p1, p2)
    // 2) p4 is at same distance from p2 and p3
    if (d2 == d3 && 2 * d2 == d4) {
        let d = distSq(p2, p4);
        return (d == distSq(p3, p4) && d == d2);
    }

    if (d3 == d4 && 2 * d3 == d2) {
        let d = distSq(p2, p3);
        return (d == distSq(p2, p4) && d == d3);
    }
    if (d2 == d4 && 2 * d2 == d3) {
        let d = distSq(p2, p3);
        return (d == distSq(p3, p4) && d == d2);
    }

    return false;
}


/**
 * 是否是正方形图层
 * @param layer
 * @returns {*}
 */
function isSqu(layer) {
    const points = layer.path ? layer.path.points : layer.points;
    if (points.length !== 4) {
        return false;
    }
    const rectPoints = points.map(x => toPoint(x.point, layer));
    const _isSquare = isSquare(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
    return _isSquare;
}

/**
 * 是否是长方形
 * @param layer
 * @returns {*}
 */
function isRect(layer) {
    const points = layer.path ? layer.path.points : layer.points
    if (points.length !== 4) {
        return false;
    }
    const rectPoints = points.map(x => toPoint(x.point, layer));
    if (rectPoints.length === 4) {
        const isRect = IsRectangleAnyOrder(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
        const hasCurveTo = points.filter(x => x.hasCurveTo === true).length > 0;
        return isRect && !hasCurveTo;
    }
    return false;
}

/**
 * 是否是圆形
 * @param layer
 * @returns {boolean}
 */
function isCircle(layer) {
    const points = layer.path ? layer.path.points : layer.points;
    if (!points || points.length !== 4) {
        return false;
    }
    const isSquare = isSqu( layer);
    const hasCurveTo = points.filter(x => x.hasCurveTo === true).length === 4;
    if (isSquare && hasCurveTo) {
        return true;
    }
    return false;
}

function IsRectangleAnyOrder(a, b, c, d) {
    return IsRectangle(a, b, c, d) || IsRectangle(b, c, a, d) || IsRectangle(c, a, b, d);
}

function IsRectangle(a, b, c, d) {
    return IsOrthogonal(a, b, c) && IsOrthogonal(b, c, d) && IsOrthogonal(c, d, a);
}

function IsOrthogonal(a, b, c) {
    return (b.x - a.x) * (b.x - c.x) + (b.y - a.y) * (b.y - c.y) === 0;
}

function getAngle(point1, point2) {
    if(!point1 || !point2) return 0;
    const { x: x1, y: y1} = point1;
    const { x: x2, y: y2} = point2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const deg = angle * 180 / Math.PI;
    return deg + 90;
}


function getGradientStyle(gradient) {
    if(!gradient) return;

    const from = toPoint(gradient.from);
    const to = toPoint(gradient.to);
    let stops = gradient.stops.map(stop => `${color(stop.color)} ${stop.position * 100}%`);

    // 线性渐变
    if(gradient.gradientType === 0) {
        let deg = getAngle(from, to);
        return `linear-gradient(${deg}deg, ${stops.join(', ')})`
    } else if(gradient.gradientType === 1) { // 径向渐变
        return `radial-gradient(circle at ${from.x} ${from.y}, ${stops.join(', ')})`
    } else if(gradient.gradientType === 2) { // 圆锥渐变
        // TODO: 待补充
        return;
    }
    return;
}

/**
* 比例转换成具体位置
* @param p
* @param dom
* @returns {{x: number, y: number}}
*/
function toPoint(p, dom) {
   let refWidth = 1;
   let refHeight = 1;
   if (dom) {
       refWidth = dom.frame.width;
       refHeight = dom.frame.height;
   }
   p = p.substring(1);
   p = p.substring(0, p.length - 1);
   p = p.split(',');

   return {
       x: Number(p[0].trim()) * refWidth,
       y: Number(p[1].trim()) * refHeight
   };
}

/**
 * 序列化 style
 * @param style
 * @returns {Array}
 */
function getStyleString(style) {
    let styleString = [];
    for (let i in style) {
        if (style[i] !== null && style[i] !== undefined ) {
            styleString.push(`${i}: ${style[i]}`);
        }
    }
    styleString = styleString.join(';');
    return styleString;
}

/**
* 忽略 null 和 undefined 的 assign
* @param target
* @param source
* @returns {{}}
*/
function assign(target, source){
   let result = {};
   for (let i in target) {
       if (target[i] !== undefined && target[i] !== null) {
           result[i] = target[i];
       }
   }
   for (let i in source) {
       if (source[i] !== undefined && source[i] !== null) {
           result[i] = source[i];
       }
   }
   return result;
}

function px2rem(value){
    if (value) {
        value = value / 75;
        value = parseFloat(value).toFixed(6);
        return (value + 'rem');
    }
    return null;
}

module.exports = {
    color,
    isSquare,
    isSqu,
    isRect,
    isCircle,
    IsRectangleAnyOrder,
    IsRectangle,
    IsOrthogonal,
    getAngle,
    getGradientStyle,
    toPoint,
    getStyleString,
    assign,
    px2rem
};
