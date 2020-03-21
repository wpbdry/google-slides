import { readFile } from 'fs'
import googleapis from 'googleapis'
const { google } = googleapis

class Services {
    /**
     * 
     * @param {string} credentialsPath Path to Google service account credentials JSON file.
     */
    constructor(credentialsPath) {
        if (!credentialsPath) return console.log('Error. No `credentialsPath` provided')
        this.scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/presentations']
        this.credentialsPath = credentialsPath
        this.credentials = this.getCredentialsFromPath().catch(e => console.log(e))
        this.auth = this.authorize().catch(e => console.log(e))
        this.drive = this.createDriveService().catch(e => console.log(e))
        this.slides = this.createSlidesService().catch(e => console.log(e))
    }
    /**
     * 
     * @param {string} credentialsPath Path to Google service account credentials JSON file.
     */
    async getCredentialsFromPath(credentialsPath) {
        return new Promise((resolve, reject) => readFile(
            credentialsPath || this.credentialsPath,
            (error, bytes) => {
                if (error) reject(error)
                try { resolve(JSON.parse(bytes)) } catch (error) { reject(error) }
            }
        ))
    }
    /**
     * 
     * @param {{}}       credentials JavaScript object from Google service account credentials JSON file.
     * @param {[string]} scopes      List of Google scope URLs.
     */
    async authorize(credentials, scopes) {
        if (!credentials) credentials = await this.credentials
        if (!credentials) throw Error('No credentials')
        const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes || this.scopes)
        await auth.authorize().catch(error => { throw error })
        return auth
    }
    /**
     * 
     * @param {{}} auth Auth object created by `google.auth.JWT()`
     */
    async createDriveService(auth) {
        if (!auth) auth = await this.auth
        return google.drive({ version: 'v3', auth }) 
    }
    /**
     * 
     * @param {{}} auth Auth object created by `google.auth.JWT()`
     */
    async createSlidesService(auth) {
        if (!auth) auth = await this.auth
        return google.slides({ version: 'v1', auth })
    }
}

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
        .catch(e => { throw e.errors })
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
        .catch(e => { throw e.errors })
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

// NOTES:

// Presentation class?

// TODO: update token if expired
// TODO: set up proper logging / error handling
// TODO: refactor into multiple files
// TODO: publish on NPM
// TODO: CI/CD?