const fs = require('fs')
const http = require('http')
const path = require('path')
const csv = require('csvtojson')
const fromPairs = require('lodash/fromPairs')

const URL_SHEET = 'https://docs.google.com/spreadsheets/d/1Az0Ce4KK2Yx-8LdDjgmuYJN0S6x1twjL96UNoqq8SdA/gviz/tq?usp=sharing&tqx=out:csv&gid=0'
const ns = 'translation'

function downloadSheet () {
  console.log('started download....')
  return new Promise((resolve, reject) => {
    const csvFile = path.resolve(__dirname, 'data.csv')
    const file = fs.createWriteStream(csvFile)
    http.get(URL_SHEET, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(csvFile)
      })
    })
  })
}

function asyncTransform (csvFile) {
  const m = new Map()
  return new Promise((resolve, reject) => csv({
    trim: true,
    ignoreEmpty: true,
    checkType: true
  })
    .fromFile(csvFile)
    .on('json', (result) => {
      const key = result._key
      const lngs = Object.keys(result).slice(1)
      for (const lng of lngs) {
        const translated = result[lng]
        if (m.has(lng)) {
          const _t = m.get(lng)
          Object.assign(_t[ns], {
            [key]: translated
          })
        } else {
          m.set(lng, {
            [ns]: {
              [key]: translated
            }
          })
        }
      }
    })
    .on('done', () => {
      resolve((Array.from(m)))
    }))
}
downloadSheet()
  .then(asyncTransform)
  .then((result) => fromPairs(result))
  .then(async (data) => {
    await fs.writeFileSync(path.resolve(__dirname, 'translated-data.json'), JSON.stringify(data))
  })
