const util = require("../utils");

module.exports = function(node, nodeStyle) {
    const dom = node.el;
    if(!dom) return nodeStyle

    let { style = {}, attributedString } = dom;
    if(!style.textStyle) return nodeStyle;

    const decodedAttributedString = attributedString.attributes[0];
    let encodedAttributes = style.textStyle.encodedAttributes;

    // 字体颜色
    nodeStyle.color = encodedAttributes && util.color(encodedAttributes.MSAttributedStringColorAttribute);
    if (!nodeStyle.color && decodedAttributedString.attributes.MSAttributedStringColorAttribute) {
        nodeStyle.color = util.color(decodedAttributedString.attributes.MSAttributedStringColorAttribute);
    }

    // 字体样式和大小
    nodeStyle.fontSize = encodedAttributes && encodedAttributes.MSAttributedStringFontAttribute.attributes.size;
    nodeStyle.fontFamily = encodedAttributes && encodedAttributes.MSAttributedStringFontAttribute.attributes.name;
    let MSAttributedStringFontAttribute = decodedAttributedString.attributes.MSAttributedStringFontAttribute;
    if (MSAttributedStringFontAttribute) {
        let fontAttr = MSAttributedStringFontAttribute.attributes;
        nodeStyle.fontSize = nodeStyle.fontSize || fontAttr.size;
        nodeStyle.fontFamily = nodeStyle.fontFamily || fontAttr.name;
    }

    nodeStyle.letterSpacing = encodedAttributes.kerning
    if (!nodeStyle.letterSpacing && decodedAttributedString.attributes.kerning ){
        nodeStyle.letterSpacing = decodedAttributedString.attributes.kerning;
    }

    let paragraphStyle = encodedAttributes.paragraphStyle || decodedAttributedString.attributes.paragraphStyle;
    if (paragraphStyle) {
        const paragraphSpacing = paragraphStyle.paragraphSpacing;
        const maxLineHeight = paragraphStyle.maximumLineHeight;
        const minLineHeight = paragraphStyle.minimumLineHeight;
        if (paragraphStyle.alignment) {
            nodeStyle.textAlign = paragraphStyle.alignment;
        } else {
            nodeStyle.textAlign = 0;
        }
        nodeStyle.minLineHeight = minLineHeight;
        nodeStyle.maxLineHeight = maxLineHeight;
        nodeStyle.lineHeight = minLineHeight; //+ paragraphSpacing;
        nodeStyle.paragraphSpacing = paragraphSpacing;
    }
    nodeStyle.text = attributedString.string.split(/\n/g).join(`<div style="height:${util.px2rem(nodeStyle.paragraphSpacing)}"></div>`);

    return nodeStyle;
}
