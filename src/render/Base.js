const { px2rem } = require('../utils');

class Base {
    constructor(node, parentNode) {
        this.node = node;
        this.parentNode = parentNode;
    }

    getPosition() {
        let frame = this.node?.frame;
        if (!frame) return {};

        return {
            position: 'absolute',
            left: px2rem(frame.x),
            top: px2rem(frame.y),
            width: px2rem(frame.width),
            height: px2rem(frame.height),
        }
    }

    generateStyle() {
        let style = this.node?.style || {};
        return {
            // 位置样式
            ...this.getPosition(),

            /**
             * // 公有样式
             * transform
             * transformOrigin
             * opacity
             * boxShadow
             * backgroundColor
             */
            'transform': style.transform,
            'transform-origin': style.transformOrigin,
            'opacity': style.opacity,
            'box-shadow': style.boxShadow,

            /**
             * // 边框
             * textStrokeWidth
             * textStrokeColor
             * borderWidth
             * borderStyle
             * borderPosition
             * borderImage
             * borderColor
             */

            /**
             * // 字体
             * color
             * fontSize
             * fontFamily
             * letterSpacing
             * textAlign
             * minLineHeight
             * maxLineHeight
             * lineHeight
             * paragraphSpacing
             */

            /**
             * 
             * // 填充
             * fillImage
             * fillColor
             */

            /**
             * // 矩形图形特有
             * borderRadius
             */
        }
    }

    toStyleString(style) {
        let styleString = [];
        for (let i in style) {
            let stl = style[i];

            if (stl === null || stl === undefined) {
                continue;
            }

            if (Array.isArray(stl)) {
                styleString.push(`${i}: ${stl.join(' ')}`);
            } else {
                styleString.push(`${i}: ${stl}`);
            }
        }
        styleString = styleString.join(';');
        return styleString;
    }

    renderHtml() {

    }
}

module.exports = Base;
