import { Services } from './services.js'
import { HTTPError, TextRequiredError, ReplaceTextRequiredError, ObjectReplacementTextRequiredError, ImageURLRequiredError } from './errors/api-errors.js'

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
    async sharePresentation(fileId, emailAddress, role = 'writer', type = 'user', sendNotificationEmail = false) {
        const requestBody = { emailAddress, role, type }
        return (await this.driveService).permissions.create({ fileId, sendNotificationEmail, requestBody })
        .then(r => r.data)
        .catch(e => { throw new HTTPError(e) })
    }
    /**
     * 
     * @param {string}                                      presentationId The ID of the presentation.
     * @param {TextReplacement | ShapeReplacementWithImage} updates        A list of updates.
     */
    async presentationBatchUpdate(presentationId, updates) {
        if (!Array.isArray(updates)) updates = [ updates ]
        const requests = updates.map(update => update.request)
        return (await this.slidesService).presentations.batchUpdate({ presentationId, resource: { requests } })
        .then(() => {})
    }
}

export class TextReplacement {
    /**
     * 
     * @param {string}  text        The text to replace.
     * @param {string}  replaceText The replacement text.
     * @param {boolean} matchCase   Whether `text` must match case exactly.
     */
    constructor(text, replaceText, matchCase = true) {
        if (!text) throw new TextRequiredError
        if (!replaceText) throw new ReplaceTextRequiredError
        this.request = {
            replaceAllText: {
                containsText: {
                    text,
                    matchCase
                },
                replaceText: replaceText
            }
        }
    }
}

export class ShapeReplacementWithImage {
    /**
     * 
     * @param {string} text 
     * @param {string} imageUrl 
     * @param {boolean} matchCase 
     * @param {string} replaceMethod 
     */
    constructor(text, imageUrl, matchCase = true, replaceMethod = 'CENTER_INSIDE') {
        if (!text) throw new ObjectReplacementTextRequiredError
        if (!imageUrl) throw new ImageURLRequiredError
        this.request = {
            replaceAllShapesWithImage: {
                imageUrl,
                replaceMethod,
                containsText: {
                    text,
                    matchCase
                }
            }
        }
    }
}
