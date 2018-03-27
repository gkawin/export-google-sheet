const http = require('https')
const path = require('path')
const fs = require('fs')

const URL_SHEET = 'https://docs.google.com/spreadsheets/d/1Az0Ce4KK2Yx-8LdDjgmuYJN0S6x1twjL96UNoqq8SdA/gviz/tq?usp=sharing&tqx=out:csv&gid=0'

export default function downloadSheet () {
  console.log('started download....')
  return new Promise((resolve, reject) => {
    const csvFile = path.resolve('data.csv')
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
