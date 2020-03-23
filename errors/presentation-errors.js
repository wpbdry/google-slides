import { ObjectRequiredError } from './base-errors.js'

export class PresentationIDRequiredError extends ObjectRequiredError {
    /**
     * 
     * @param {{}} propertiesPassed The properties passed to the Presentation constructor.
     */
    constructor(propertiesPassed) {
        super(
            'id',
            'create Presentation',
            'Use `new Presentation({ id: \'presentation-id\' })`'
        )
        this.propertiesPassed = propertiesPassed
    }
}

export class PresentationAPIRequiredError extends ObjectRequiredError {
    /**
     * 
     * @param {string} action The action (imperative) that cannot be performed without this object.
     */
    constructor(action = 'perform API actions') {
        super(
            'api',
            action,
            'Use `presentation.api = api`',
        )
    }
}
