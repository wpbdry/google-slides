import chai from 'chai'
const { expect } = chai
import { Presentation } from '../index.js'

describe('#Presentation', () => {
    it('should create a class with ID', () => {
        const id = 'test-id'
        const presentation = new Presentation({ id })
        expect(presentation.id).to.equal(id)
    })
})
