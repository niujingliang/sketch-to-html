const util = require('../utils');
const Base = require('./Base');

class Element extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);
    }

    generateStyle () {
        let { frame, style } = this.node;
        let parentNode = this.parentNode;

        let finalStyle = {
            'color': style.color,
            'background-image': style.fillImage ? style.fillImage : null,
            'background-color': style.backgroundColor || style.fillColor,
            'border-radius': util.px2rem(style.borderRadius),
            'border-color': style.borderColor,
            'border-width': util.px2rem(style.borderWidth),
            'border-style': style.borderStyle,
        };


        let parentOtherStyle = {};

        if(parentNode && parentNode.type == 'shapeGroup') {
            let parentStyle = parentNode.style;
            let width = frame.width, height = frame.height;

            parentOtherStyle = {
                'color': parentStyle.color,
                'background-color': parentStyle.backgroundColor,
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
            delete parentStyle['background']
            delete parentStyle['background-image']
            delete parentStyle['background-color']
        }

        finalStyle = util.assign(parentOtherStyle, finalStyle);

        return  {
            ...super.generateStyle(),
            ...finalStyle,
        }
    }

    renderHtml (children) {
        let node = this.node;
        let style = this.generateStyle();
        return `<div id="${node.id}" class="${node.name}" style="${this.toStyleString(style)}" >
    ${children}
</div>`;
    }
}

module.exports = Element;