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
     * @param {{}}     propertiesPassed The properties passed to the TextReplacement constructor.
     * @param {string} missingKey The name of the key missing in `propertiesPassed`
     */
    constructor(propertiesPassed, missingKey) {
        super(
            missingKey,
            'create TextReplacement',
            'Use `new TextReplacement({ text: \'example text\', replaceText: \'example replacement text\' })`'
        )
        this.propertiesPassed = propertiesPassed
    }
}

export class TextRequiredError extends TextReplacementError {
    /**
     * 
     * @param {{}} propertiesPassed The properties passed to the TextReplacement constructor.
     */
    constructor(propertiesPassed) {
        super(propertiesPassed, 'text')
    }
}

export class ReplaceTextRequiredError extends TextReplacementError {
    /**
     * 
     * @param {{}} propertiesPassed The properties passed to the TextReplacement constructor.
     */
    constructor(propertiesPassed) {
        super(propertiesPassed, 'replaceText')
    }
}
