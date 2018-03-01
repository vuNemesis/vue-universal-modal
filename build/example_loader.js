"use strict";
var fs = require('fs-extended');
const _ = require('lodash');
const Babel =  require('babel-standalone');
const compiler = require("vue-template-compiler");

module.exports = function loader(source, map) {
    let ex = []
    let props = {}
    const blocks = compiler.parseComponent(source, { pad: "space" })

    if(blocks.script && blocks.script.content) {
         const { code } = Babel.transform(
              blocks.script.content, { presets: ["es2015"] },
            );
        props = eval(`const exports = {};${code}`); // eslint-disable-line
    }

    if(blocks.customBlocks.length) {
        const examples = blocks.customBlocks.filter(block => block.type ==='example')
        if(examples.length) {
            examples.forEach((example, index) => {
                let title, description, script, template, key, code, data, info
                const blocksExample = compiler.parseComponent(example.content, { pad: "space" })
                if(blocksExample.customBlocks.length) {
                    title = blocksExample.customBlocks.find(block => block.type ==='title')
                    description = blocksExample.customBlocks.find(block => block.type ==='description')
                    info = blocksExample.customBlocks.find(block => block.type ==='info')

                    script = blocksExample.script
                    template = blocksExample.template

                    key = title ? _.camelCase(title.content) : ''
                    title = title ? _.trim(title.content) : ''
                    description = description ? _.trim(description.content) : ''
                    script = script ? _.trim(script.content) : ''
                    template = template ? _.trim(template.content) : ''
                    code = '<template>\n' + template + '\n</template>\n\n<script>\n' + script + '\n<' + '/script>'
                    info = info ? _.trim(info.content) : ''

                    data = {}
                    data.title = example.attrs.title || title
                    data.description = description
                    data.info = info
                    data.template = template
                    data.script = script
                    data.key = key
                    data.code = code
                    ex.push(data)
                }
            })
        }
    }

    const extension = '.ex.vue'
    const dir = `${this.context}/`
    const files = fs.listFilesSync(dir)
    const filter = /\.ex\.vue$/ig
    let exfiles = files.filter(file => filter.test(file))
    let newFiles = ex.map(example => `${example.key}${extension}`)
    // let deleteFiles = _.difference(exfiles, newFiles)
    // exfiles.forEach(file => fs.unlinkSync(`${dir}/${file}`))

    let filePath;
    ex.forEach(example => {
        filePath = `${dir}/${example.key}${extension}`
        fs.writeFileSync(filePath, example.code)
    })

   let str = `let examples = ${JSON.stringify(ex)};`
   str += `examples = examples.map(ex => {`
   str += `let s = './';ex.cmp = require(s + ex.key + '.ex.vue');`
   str += `return ex;}); let source = {}; source.examples = examples; source.props = ${JSON.stringify(props)}; module.exports = source;`
   return str;
};
