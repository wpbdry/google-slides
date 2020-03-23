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
     * @param {string} objectName   The name of the required object.
     * @param {string} action       The action (imperative) that cannot be performed without this object.
     * @param {string} tip          Instructions on how to resolve this error.
     * @param {*}      parentObject The parent of the missing object, if applicable.
     */
    constructor(objectName, action, tip = '', parentObject = undefined) {
        super(`Object \`${objectName}\` is required to ${action}. ${tip}`)
        this.objectName = objectName
        this.action = action
        this.tip = tip
        this.parentObject = parentObject
    }
}
