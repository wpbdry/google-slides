import { API, Presentation } from '../index.js'

const api = new API('credentials.json')
const template = new Presentation({ id: '1yMEqtOta984dwNyJoeU92tsC5x7GV2fQK7V4wJc60Mg' }, api)
template.copy()
.then(newPresentation => {
    console.log(newPresentation.url)
    newPresentation.share('william.dry@phiture.com')
    .catch(e => console.log('Share error:', e))
    newPresentation.replaceAllText({
        text: '{{Hello}}',
        replaceText: 'Whazuuuup'
    })
    .catch(e => console.log('Replace error:', e))
})
.catch(e => console.log('Copy error:', e))
