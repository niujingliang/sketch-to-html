const util = require('../utils');
const Base = require('./Base');

class ShapePath extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);
    }

    generateStyle () {
        let { style } = this.node;
        let { style: parentStyle } = this.parentNode || {}

        let finalStyle = {
            fill: parentStyle.fillColor || style.fillColor ||style.backgroundColor || 'none',
            stroke: parentStyle?.borderColor,
            'stroke-width': parentStyle.borderWidth ? (parentStyle.borderWidth + 'px') : 1,

            color: style.color,
            'border-radius': util.px2rem(style.borderRadius),
            'line-height': util.px2rem(style.lineHeight) || 'normal',
            'margin-top': util.px2rem(style.marginTop),
            'font-size': util.px2rem(style.fontSize),
            'border-color': style.borderColor,
            'border-width': util.px2rem(style.borderWidth),
            'border-style': style.borderStyle,
            'box-shadow': style.boxShadow,
            '-webkit-text-stroke-width': util.px2rem(style.textStrokeWidth),
            '-webkit-text-stroke-color': util.px2rem(style.textStrokeColor)
        };

        return {
            ...super.generateStyle(),
            ...finalStyle,
        };
    }

    // svg的渐变填充有些不同，需要转换成svg定义
    getGradientFill() {
        let node = this.node;
        if(!node) return;

        let { style, el: dom } = node;
        if(!style || !style.fillImage) return;

        let fill = dom?.style?.fills[0];
        if(!fill) return;

        let gradient = fill.gradient;
        let from = util.toPoint(gradient.from);
        let to = util.toPoint(gradient.to);
        const gradientId = node.id.replace(/-/g,'');
        if(style.fillImage.indexOf('linear-gradient') > -1) {
            return {
                id: gradientId,
                styleText: `<linearGradient id="${gradientId}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}">
    ${gradient.stops.map(stop => `<stop offset="${stop.position * 100}%" stop-color="${util.color(stop.color)}" />`).join('')}
</linearGradient>`
            }
        }

        if(style.fillImage.indexOf('radial-gradient') > -1) {
            return {
                id: gradientId,
                styleText: `<radialGradient id="${gradientId}" cx="${from.x}" cy="${from.y}" fx="${to.x}" fy="${to.y}">
    ${gradient.stops.map(stop => `<stop offset="${stop.position * 100}%" stop-color="${util.color(stop.color)}" />`).join('')}
</radialGradient >`
            }
        }
        return;
    }

    renderHtml () {
        let node = this.node;
        let style = this.generateStyle();
        let gradient = this.getGradientFill();

        return `<svg id="${node.id}" version="1.1" xmlns="http://www.w3.org/2000/svg" class="${node.name}" style="${this.toStyleString(style)}">
    ${ gradient ? `<defs>${gradient.styleText}</defs>` : '' }
    <path d="${node.path}"} ${ gradient ? `fill="url(#${gradient.id})"`: '' }/>
</svg>`;
    }
}
ShapePath.isShapePath = function (layer, parentLayer) {
    return (layer.type === 'oval' && !layer.isCircle) ||
      (layer.type === 'rectangle' && !layer.isRect) ||
      (layer.path && layer.type === 'shapePath');
};
module.exports = ShapePath;