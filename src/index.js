const { createNode } = require('./nodes');
const render = require('./render');

/**
 * 将Sketch页面协议转换成功中间DSL
 * @param {Array} pages sketch页面JSON
 * @returns {Array} 中间DSL
 */
function convertToDSL(pages = []) {
    let DSLs = [];
    pages.forEach((page) => DSLs.push(createNode(page)));
    return DSLs;
}

/**
 * 将DSL转换成HTML
 * @param {Array} DSL
 * @returns {Array<Array>} Html
 */
function _render(DSLs = []) {
    let htmls = [];
    DSLs.forEach((dsl) => {
        htmls.push(...render(dsl))
    });
    return htmls;
}

module.exports = {
    convertToDSL,
    render: _render,
}
