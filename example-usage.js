import { Services } from './index.js'

(async function() {
    const services = new Services('credentials.json')
    console.log(await services)
})()
