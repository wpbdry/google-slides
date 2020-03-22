import { ObjectRequiredError } from './base-errors.js'

export class CredentialsPathRequiredError extends ObjectRequiredError {
    constructor() {
        super(
            'credentialsPath',
            'initialize Services',
            'Use `new Services(\'path/to/credentials.json\')`'
        )
    }
}
