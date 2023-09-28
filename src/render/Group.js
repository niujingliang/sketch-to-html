const Base = require('./Base');

class Group extends Base {
    constructor (node, parentNode) {
        super(node, parentNode);
    }

    generateStyle () {
        let { style } = this.node;
        return {
            ...super.generateStyle(),
            'background': style.fillColor,
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

module.exports = Group;