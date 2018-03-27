const csv = require('csvtojson')

const ns = 'translation'

export default function asyncTransform (csvFile) {
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
