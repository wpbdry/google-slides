export class Presentation {
    /**
     * 
     * @param {{}}  properties The properties of the presentation.
     * @param {API} The API instance that should be used to interact with this Presentation.
     */
    constructor(properties, api) {
        if (!properties.id) throw 'Presentation must be initialized with an `id`'
        for (const key in properties) this[key] = properties[key]
        this.api = api
    }
    checkAPIExists() { if (!this.api) throw 'This presentation does not have an associated API. Use `presentation.api = api`' }
    /**
     * 
     * @param {API} api The API instance that should be used to interact with the new Presentation.
     */
    async copy(api = this.api, ...args) {
        this.checkAPIExists()
        return this.api.copyPresentation(this.id, ...args)
        .then(newPres =>  new Presentation(newPres, api))
        .catch(e => { throw e })
    }
    /**
     * 
     * @param {string} emailAddress           The email address of the user or group with whom to share this Presentation.
     * @param {string} role                   owner | organizer | fileOrganizer | writer | commenter | reader
     * @param {string} type                   user | group | domain | anyone
     * @param {string} sendNotificationEmails Whether to send a notification email when sharing to users or groups.
     */
    async share(...args) {
        this.checkAPIExists()
        return this.api.sharePresentation(this.id, ...args)
        .catch(e => { throw e })
    }
    /**
     * 
     * @param {{ text: string, replaceText: string, matchCase: string: true }} | [] textReplacements The text to replace.
     */
    async replaceAllText(...args) {
        this.checkAPIExists()
        return this.api.replaceAllText(this.id, ...args)
        .catch(e => { throw e })
    }
}
