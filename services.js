import { readFile } from 'fs'
import googleapis from 'googleapis'
const { google } = googleapis
import { CredentialsPathRequiredError } from './errors/services-errors.js'

export class Services {
    /**
     * 
     * @param {string} credentialsPath Path to Google service account credentials JSON file.
     */
    constructor(credentialsPath) {
        if (!credentialsPath) throw new CredentialsPathRequiredError
        this.scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/presentations']
        this.credentialsPath = credentialsPath
        this.credentials = this.getCredentialsFromPath().catch(e => { throw e })
        this.auth = this.authorize().catch(e => { throw e })
        this.drive = this.createDriveService().catch(e => { throw e })
        this.slides = this.createSlidesService().catch(e => { throw e })
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
        return new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes || this.scopes)
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
