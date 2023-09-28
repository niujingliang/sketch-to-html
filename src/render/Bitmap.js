const util = require('../utils');
const Base = require('./Base');

class Bitmap extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);
    }

    generateStyle () {
        let style = this.node.style;
        return {
            ...super.generateStyle(),
            
            'background-image': style.fillImage ? style.fillImage : null,
            'background-color': style.backgroundColor,

            "color": style.color,

            'border-radius': util.px2rem(style.borderRadius),
            'border-color': style.borderColor,
            'border-width': util.px2rem(style.borderWidth),
            'border-style': style.borderStyle,
            'overflow': 'hidden',
        };
    }

    renderHtml () {
        let node = this.node;
        let style = this.generateStyle();

        let color = style['background-color'];
        // 处理图片变色的特性
        let imgStyle = {};
        imgStyle['position'] = 'absolute';
        imgStyle['width'] = '100%';
        imgStyle['height'] = '100%';
        if(color) {
            imgStyle['left'] = '-10000px';
            imgStyle['-webkit-filter'] = `drop-shadow(${color} 10000px 0px)`;
        }
        delete style['background-color'];

        return `<div id="${node.id}" style="${this.toStyleString(style)}" class="${node.name}">
    <img style="${this.toStyleString(imgStyle)}" src="${node.image}" />
</div>`;
    }
}

module.exports = Bitmap;