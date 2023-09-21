const path = require('path');
const converter = require('../index');

const resolve = (p) => path.resolve(__dirname, p);

// const sketchPath = './test/Ant.Design.Components.5.0.Beta.sketch';
// const sketchPath = './test/ooto.sketch';
const sketchPath = './test.sketch';

converter(resolve(sketchPath), () => {
    console.log('finish');
})

