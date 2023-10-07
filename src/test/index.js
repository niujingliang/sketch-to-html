const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const { convertToDSL, render } = require('../index');
const template = require('../template');

const resolve = (...args) => path.resolve(__dirname, ...args);

const sketchDemoPath = resolve('./sketch');
const pagePath = resolve(sketchDemoPath, './pages');

const outputPath = resolve('../../output');

const files = fs.readdirSync(pagePath);
const pages = files.map(file => require(resolve(pagePath, file)))

// 转换DSL
let dsls = convertToDSL(pages);

// 将DSL生成网页
let htmls = render(dsls);
htmls.forEach((html, index) => {
    html = template(html);
    let dsl = dsls[index];
    fse.outputFileSync(resolve(outputPath, `./html/${dsl.id}.html`), html);
});

console.log('done');
