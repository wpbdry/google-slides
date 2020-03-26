import { PresentationIDRequiredError, PresentationAPIRequiredError } from './errors/presentation-errors.js'

export class Presentation {
    /**
     * 
     * @param {{ id: string }}  properties The properties of the presentation.
     * @param {API} The API     instance that should be used to interact with this Presentation.
     */
    constructor(properties, api) {
        if (!properties.id) throw new PresentationIDRequiredError(properties)
        for (const key in properties) this[key] = properties[key]
        this.api = api
    }
    get url() { return `https://docs.google.com/presentation/d/${this.id}/edit` }
    checkAPIExists() { if (!this.api) throw new PresentationAPIRequiredError }
    /**
     * 
     * @param {API} api The API instance that should be used to interact with the new Presentation.
     */
    async copy(api = this.api, ...args) {
        this.checkAPIExists()
        return this.api.copyPresentation(this.id, ...args)
        .then(newPres =>  new Presentation(newPres, api))
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
    }
    async batchUpdate(updates) {
        this.api.presentationBatchUpdate(this.id, updates)
    }
}
