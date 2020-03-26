import BaseError, { ObjectRequiredError } from './base-errors.js'
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

class TextReplacementError extends ObjectRequiredError {
    /**
     * 
     * @param {string} missingParam The name of the missing parameter.
     */
    constructor(missingParam) {
        super(
            missingParam,
            'create TextReplacement',
            'Use `new TextReplacement(\'example text\', \'example replacement text\')`'
        )
    }
}

export class TextRequiredError extends TextReplacementError {
    constructor() {
        super('text')
    }
}

export class ReplaceTextRequiredError extends TextReplacementError {
    constructor() {
        super('replaceText')
    }
}
