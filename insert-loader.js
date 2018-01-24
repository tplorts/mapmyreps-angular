const sass = require('node-sass')
const pug = require('pug')
const fs = require('fs')

const encoding = 'utf8'
const SourceDir = './src'
const LoaderDir = `${SourceDir}/loader`
const indexFilename = `${SourceDir}/index.html`


const styleResult = sass.renderSync({
  file: `${LoaderDir}/logo-loader.scss`,
})

const html = pug.renderFile(`${LoaderDir}/logo-loader.pug`, {
  paths: require(`${LoaderDir}/logo-loader-paths.json`),
  style: styleResult.css.toString(encoding),
  pretty: true,
})

const indexSource = fs.readFileSync(indexFilename, {encoding})

const openMarker = '<!-- pre-app-loader -->'
const closeMarker = '<!-- /pre-app-loader -->'
const iBegin = indexSource.indexOf(openMarker) + openMarker.length
const iEnd = indexSource.indexOf(closeMarker)
const newIndex = indexSource.substring(0, iBegin) + html + indexSource.substring(iEnd)

// console.log(newIndex)
fs.writeFileSync(indexFilename, newIndex)
