import BaseError from './base-errors.js'
import Gaxios from 'gaxios'

export class HTTPError extends BaseError {
    /**
     * 
     * @param {GaxiosError} error The object caught from the service method.
     */
    constructor(error) {
        // if expected format
        if (error instanceof Gaxios.GaxiosError) {
            const { code, errors } = error
            super(`API error (${code}): ${errors[0].message}`)
            this.code = code
            this.errorMessage = errors[0].message
            this.errors = errors
            return
        }
        // if unexpected format
        this.error = error
    }
}
