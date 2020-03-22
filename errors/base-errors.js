export default class BaseError extends Error {
    /**
     * 
     * @param {string} message Error message.
     */
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }
}

export class ObjectRequiredError extends BaseError {
    /**
     * 
     * @param {string} object The name of the required object.
     * @param {string} action The action (imperative) that cannot be performed without this object.
     * @param {string} tip    Instructions on how to resolve this error.
     */
    constructor(object, action, tip = '') {
        super(`Object \`${object}\` is required to ${action}. ${tip}`)
        this.object = object
        this.action = action
        this.tip = tip
    }
}
