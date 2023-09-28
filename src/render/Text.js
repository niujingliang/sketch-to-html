const util = require('../utils');
const Base = require('./Base');

class Text extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);
    }

    generateStyle () {
        let node = this.node;
        let { style, frame } = node;

        let finalStyle = {
            ...super.generateStyle(),
            'color': style.color,
            'background-color': style.backgroundColor || style.fillColor,
            'line-height': util.px2rem(style.lineHeight) || 'normal',
            'font-size': util.px2rem(style.fontSize),
            'font-family': style.fontFamily,
            'box-shadow': style.boxShadow,
            'letter-spacing': util.px2rem(style.letterSpacing),
            '-webkit-text-stroke-width': util.px2rem(style.textStrokeWidth),
            '-webkit-text-stroke-color': util.px2rem(style.textStrokeColor)
        };

        let { width, height } = frame;

        // 处理小于12px的文字图层
        if(style.fontSize && style.fontSize < 12) {
            width = width * 5;
            height = height * 5;
            finalStyle['font-size'] = util.px2rem(style.fontSize * 5);
            if(style.letterSpacing) {
                finalStyle['letter-spacing'] = util.px2rem(style.letterSpacing * 5);
            }
            
            if(style.lineHeight && !isNaN(style.lineHeight)) {
                finalStyle['line-height'] = util.px2rem(style.lineHeight * 5);
            }

            finalStyle.transform = finalStyle.transform || [];
            finalStyle.transform.push('scale(0.2)');
            finalStyle['width'] = util.px2rem(width);
            finalStyle['height'] = util.px2rem(height);
            finalStyle['top'] = util.px2rem(frame.y - (height - frame.height) / 2);
            finalStyle['left'] = util.px2rem(frame.x - (width - frame.width) / 2);
        }

        let parentOtherStyle = {};
        let parentNode = this.parentNode;
        if(parentNode && parentNode.type == 'shapeGroup') {
            let parentStyle = parentNode.style;
            parentOtherStyle = {
                'color': parentStyle.color,
                'background-color': parentStyle.backgroundColor || parentStyle.fillColor,
                'background-image': parentStyle.fillImage ? parentStyle.fillImage : null,
                'border-color': parentStyle.borderColor,
                'border-width': util.px2rem(parentStyle.borderWidth),
                'border-style': parentStyle.borderStyle,
                'border-radius': util.px2rem(parentStyle.borderRadius),
            };
            let borderWidth = parentStyle.borderWidth || 0;
            if(parentStyle.borderPosition == 0) {
                // center
                width = width - borderWidth;
                height = height - borderWidth;
            } else if(parentStyle.borderPosition == 1) {
                // inside
                let borderWidth = parentStyle.borderWidth || 0;
                width = width - borderWidth * 2;
                height = height - borderWidth * 2;
            }
            // delete this.parentLayer.finalStyle['background']
            // delete this.parentLayer.finalStyle['background-image']
            // delete this.parentLayer.finalStyle['background-color']
        }

        finalStyle = util.assign(parentOtherStyle, finalStyle);

        return finalStyle;
    }

    renderHtml () {
        let node = this.node;
        let style = this.generateStyle();
        return `<span id="${node.id}" class="${node.name}" style="${this.toStyleString(style)}" >
    ${node.text}
</span>`;
    }
}

module.exports = Text;