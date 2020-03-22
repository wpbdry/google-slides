import BaseError from './base-errors.js'

export class HTTPError extends BaseError {
    /**
     * 
     * @param {{}} response The object caught from the service method.
     */
    constructor(response) {
        const { code, errors } = response
        super(`API error (${code}): ${errors[0].message}`)
        this.code = code
        this.errorMessage = errors[0].message
        this.errors = errors
    }
}
