const Element = require('./Element');
const Bitmap = require('./Bitmap');
const Group = require('./Group');
const ShapeGroup = require('./ShapeGroup');
const ShapePath = require('./ShapePath');
const Text = require('./Text');

const elements = {
    bitmap: Bitmap,
    group: Group,
    shapeGroup: ShapeGroup,
    shapePath: ShapePath,
    text: Text,
    default: Element,
}

function createRender(node, parentNode) {
    let Element = elements[node.type] || elements.default;
    return new Element(node, parentNode);
}

function renderElement(node, parentNode) {
    if(!node.isVisible) return '';
    let render = createRender(node, parentNode);

    let children = node.children;
    let html = '';
    if(children.length > 0) {
        children.forEach(child => {
            html += renderElement(child, node)
        });
    }

    return render.renderHtml(html)
}

module.exports = function render(node) {
    let html = [];

    const findArtboard = function(node) {
        if(node.type !== 'artboard') {
            node.children.forEach(child => {
                findArtboard(child)
            })
        } else {
           html.push(renderElement(node))
        }
    }
    findArtboard(node);

    return html;
}
