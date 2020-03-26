import { API, Presentation, TextReplacement } from '../index.js'
import { ShapeReplacementWithImage } from '../api.js'

const api = new API('credentials.json')
const template = new Presentation({ id: '1yMEqtOta984dwNyJoeU92tsC5x7GV2fQK7V4wJc60Mg' }, api)
template.copy()
.then(newPresentation => {
    console.log(newPresentation.url)
    newPresentation.share('william.dry@phiture.com')
    .catch(e => console.log('Share error:', e))
    newPresentation.batchUpdate([
        new TextReplacement('{{Hello}}', 'Whazzuuuuupp'),
        new ShapeReplacementWithImage('{{img}}', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cat-quotes-1543599392.jpg')
    ])
    .catch(e => console.log('Replace error:', e))
})
.catch(e => console.log('Copy error:', e))
