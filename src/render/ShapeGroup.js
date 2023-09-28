const util = require('../utils');
const Base = require('./Base');

class ShapeGroup extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);

        let { style } = node;
        if(style.fillImage && node.children.length == 1) {
            node.children[0].style.fillImage = style.fillImage;
            style.fillImage = null;
        }
    }

    generateStyle () {
        // let { style } = this.node;
        let finalStyle = {
            // 'background-color': style.backgroundColor,
            // 'background-image': style.fillImage ? style.fillImage : null,
            // 'background': style.fillColor,
        };
        
        return {
            ...super.generateStyle(),
            ...finalStyle,
        };
    }

    renderHtml (children) {
        let node = this.node;
        let style = this.generateStyle();
        return `<div id="${node.id}" class="${node.name}" style="${this.toStyleString(style)}" >
    ${children}
</div>`;
    }
}

module.exports = ShapeGroup;