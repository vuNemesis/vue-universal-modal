const compiler = require("vue-template-compiler");
const _ = require('lodash');

module.exports = function (source, map) {
   var callback = this.async();
  this.loadModule(`!raw-loader!${this.resourcePath}`, (err, sourceParent, sourceMap, module) => {
    const raw = eval(sourceParent)
    const example = parseSource(raw, source)
    callback(null, 'module.exports = function(Component) {Component.options.__example = ' + JSON.stringify(example).trim() + '}', map)
  })
  // this.callback(null, 'module.exports = function(Component) {if(!Component.options.__examples) Component.options.__examples = []; Component.options.__examples.push(' +
  //   JSON.stringify(source).trim() +
  //   ')}', map)
}

// module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    
// };

function parseSource(source, sourceExample) {
  const blocks = compiler.parseComponent(source, { pad: "space" })
  const template = blocks.template ? _.trim(blocks.template.content) : ''
  const script = blocks.script ? _.trim(blocks.script.content) : ''
  let info = {}
  let key
  const blocksExample = compiler.parseComponent(sourceExample, { pad: "space" })
  if(blocksExample.customBlocks.length) {
    blocksExample.customBlocks.forEach(block => {
      info[block.type] = _.trim(block.content)
    })
    key = info.title ? _.camelCase(info.title) : ''
  }
  return {
    key,
    template,
    script,
    info
  }
}