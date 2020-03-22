import { Services } from './services.js'
import { HTTPError } from './errors/api-errors.js'

export class API {
    /**
     * 
     * @param {string} credentialsPath Path to Google service account credentials JSON file.
     */
    constructor(credentialsPath) {
        this.services = new Services(credentialsPath)
    }
    get driveService() { return this.services.drive }
    get slidesService() { return this.services.slides }

    /**
     * 
     * @param {string} fileId The ID of the file to copy.
     */
    async copyPresentation(fileId) {
        return (await this.driveService).files.copy({ fileId })
        .then(r => r.data)
        .catch(e => { throw new HTTPError(e) })
    }
    /**
     * 
     * @param {string} fileId                 The ID of the file.
     * @param {string} emailAddress           The email address of the user or group to which this permission refers.
     * @param {string} role                   owner | organizer | fileOrganizer | writer | commenter | reader
     * @param {string} type                   user | group | domain | anyone
     * @param {string} sendNotificationEmails Whether to send a notification email when sharing to users or groups.
     */
    async sharePresentation(fileId, emailAddress, role = 'writer', type = 'user', sendNotificationEmails = false) {
        const requestBody = { emailAddress, role, type, sendNotificationEmails }
        return (await this.driveService).permissions.create({ fileId, requestBody })
        .then(r => r.data)
        .catch(e => { throw new HTTPError(e) })
    }
    /**
     * 
     * @param {string}                                                              presentationId   The ID of the presentation.
     * @param {{ text: string, replaceText: string, matchCase: string: true }} | [] textReplacements The text to replace.
     */
    async replaceAllText(presentationId, textReplacements) {
        if (!Array.isArray(textReplacements)) textReplacements = [textReplacements]
        const requests = []
        for (const textReplacement of textReplacements) {
            if (!textReplacement.text) throw `\`textReplacement\` object ${JSON.stringify(textReplacement)} does not contain a \`text\` property`
            if (!textReplacement.replaceText) throw `\`textReplacement\` object ${JSON.stringify(textReplacement)} does not contain a \`replaceText\` property`
            requests.push({ replaceAllText: {
                containsText: {
                    text: textReplacement.text,
                    matchCase: textReplacement.matchCase !== undefined ? textReplacement.matchCase : true
                },
                replaceText: textReplacement.replaceText
            } })
        }
        return (await this.slidesService).presentations.batchUpdate({ presentationId, resource: { requests } })
        .then(() => {})
        .catch(e => { throw e.errors })
    }
}
