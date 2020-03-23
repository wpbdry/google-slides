# google-slides
## NPM package for some simple Google Slides operations
[![Build Status](https://travis-ci.org/wpbdry/google-slides.svg?branch=main)](https://travis-ci.org/wpbdry/google-slides)

### contents
- [prerequisites](#prerequisites)
- [preparation](#preparation)
- [installation](#installation)
- [Presentation](#presentation)
    - [copy](#copy)
    - [share](#share)
    - [Presentation.replaceAllText](#presentationreplacealltext)
- [API](#api)
    - [copyPresentation](#copypresentation)
    - [sharePresentation](#sharepresentation)
    - [API.replaceAllText](#apireplacealltext)
- [underlying services](#underlying-services)
    - [driveService](#driveservice)
    - [slidesService](#slidesservice)
    - [why `await`?](#why-await)

### prerequisites
- a Google account
- familiarity with [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/)

### preparation
1. visit the [Google developers console](https://console.developers.google.com/apis/dashboard)
2. create a new project
3. enable the Google Drive and Google Slides APIs for your project
4. create a service account connected to your project
5. generate and download JSON credentials for your service account

### installation
```shell
npm install google-slides
```

### Presentation

#### copy
```javascript
import { API, Presentation } from 'google-slides'

const api = new API('path/to/credentials.json')
const presentationId = '1yMEqtOta984dwNyJoeU92tsC5x7GV2fQK7V4wJc60Mg'
const template = new Presentation({ id: presentationId }, api)
template.copy()
.then(newPresentation => console.log(`New presentation created with name ${newPresentation.name} and ID ${newPresentation.id}.`))
.catch(e => console.log('Copy error:', e))
```

#### share
See [API.sharePresentation](#sharepresentation).
Instead of `api.sharePresentation` use `presentation.share` and don't pass `id`.

#### Presentation.replaceAllText
See [API.replaceAllText](#apireplacealltext).
Instead of `api` use `presentation` and don't pass `presentationId`.

### API
```javascript
import { API } from 'google-slides'

const api = new API('path/to/credentials.json')
```

#### copyPresentation
```javascript
api.copyPresentation(id)
.then(newPresentation => console.log(`name: ${newPresentation.name}, id: ${newPresentation.id}`))
```

#### sharePresentation
```javascript
const emailAddress = 'wpbdry@gmail.com'
const role = 'writer'  // One of: owner | organizer | fileOrganizer | writer | commenter | reader
const type = 'user'  // One of: user | group | domain | anyone
const sendNotificationEmails = false 
api.sharePresentation(id, emailAddress, role, type, sendNotificationEmails)
.then(() => console.log(`Presentation with ID ${id} successfully shared with ${emailAddress}!`))
```

#### API.replaceAllText
```javascript
api.replaceAllText(presentationId, {
    text: '{{title}}',
    replaceText: 'My Presentation'
})
.catch(error => doSomething(error))
```
or
```javascript
api.replaceAllText(presentationId, [{
    text: 'Cape',
    replaceText: 'Cape Town'
    matchCase: true
}, {
    text: 'bandana',
    replaceText: 'shawl'
}])
.catch(error => doSomething(error))
```

### underlying services
The API class implements underlying services, which can be accessed directly if they are `await`ed.
This provides access to further functions from the `googleapis` module, which may not be implemented here.

#### driveService
```javascript
import { API } from 'google-slides'

(async function() {
    const api = new API('path/to/credentials.json')
    (await api.driveService).doSomething()
})()
```
The `driveService` object here is equivelant to the `drive` object used in all the Node.js snippets in the
[Google Drive API V3 documentation](https://developers.google.com/drive/api/v3/about-files)

#### slidesService
```javascript
import { API } from 'google-slides'

(async function() {
    const api = new API('path/to/credentials.json')
    (await api.slidesService).doSomething()
})()
```
The `slidesService` object here is equivelant to the `slides` or `this.slidesService` objects used in all the Node.js snippets in the
[Google Slides API documentation](https://developers.google.com/slides/how-tos/presentations)

#### why `await`?
When `new API('path/to/credentials.json')` is called, the API logs in with the provided credentials, and initialized the underlying services.
Since logging in happens asynchronously, the services may not yet exist by the time they are used. These services are `await`ed every time
they are used in the [built in methods](#usage). You only need to `await` each service the first time you use it in any single promise chain.
