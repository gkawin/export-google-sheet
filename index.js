const fromPairs = require('lodash/fromPairs')
const path = require('path')
const fs = require('fs')

const { downloadSheet, transform } = require('./lib')

downloadSheet()
  .then(transform)
  .then((result) => fromPairs(result))
  .then(async (data) => {
    await fs.writeFileSync(path.resolve(__dirname, 'translated-data.json'), JSON.stringify(data))
  })
