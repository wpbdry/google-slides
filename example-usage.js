import { API } from './index.js'

const api = new API('credentials.json')
api.copyPresentation('1yMEqtOta984dwNyJoeU92tsC5x7GV2fQK7V4wJc60Mg')
.then(newPres => {
    console.log(newPres.id)
    api.sharePresentation(newPres.id, 'william.dry@phiture.com')
    .catch(e => console.log('Share error:', e))
    api.replaceAllText(newPres.id, {
        text: '{{Hello}}',
        replaceText: 'Whazuuuup'
    })
    .catch(e => console.log('Replace error:', e))
})
.catch(e => console.log('Copy error:', e))
