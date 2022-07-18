---
title: Page State
description: Basic features > Page State and it's usage
---

Core of each application is the data the app is working with. The data needs to be managed in some manner and user needs to be able to manipulate with the data during application run. IMA.js adopted a React style of state management.

<div class="image is-padded-with-shadow">
  <img src="{{ '/img/docs/diagram-page-state.png?v=' | append: site.github.build_revision | relative_url }}" />
</div>

A **PageStateManager** class is used for managing **page state** and is in tight cooperation with **PageManager**.
PageManager need state manager to collect initial state from Controller and registered extension, and to be informed about every state change that happens inside Controller or Extension.

## Get & Set

As we've mentioned before, IMA.js state management is inspired by React. In every Controller and Extension you can call `this.setState(patchObject)` method that will update page state and trigger new rendering of a View. Counterpart to `setState` is `getState`. This method returns current state that is shared among controller and all its registered extensions.

```javascript
// app/page/home/HomeController.js

onVisibilityToggle() {
  const { visibility } = this.getState();

  this.setState({ visibility: !visibility });
}
```

## Initial page state
First additions to page state are set when `load` method of a Controller and Extensions returns an object of resources. These resources may be plain data or (un)resolved promises. Promises are handled differently on server vs. client. This behaviour is described in Controller's [`load` method documentation](/docs/controller-lifecycle#load-serverclient).

## Partial state
Since Extensions also have a word in loading resources it may be necessary to share resources between Controller and Extensions. Here comes partial state into play. It allows you to call `getState` method in `load` method of an Extension. Received state consists of states collected from loaded Controller and Extensions loaded prior to the current Extension. Extensions are loaded in the same order as they were registered in a Controller.

> **Note**: Promises in received state may not be resolved. Therefore you need to chain promises or use `async/await`.

> **Note**: If you'll use `async/await` execution will not be parallel relative to other promises.

```javascript
// app/page/home/HomeController.js
export default class HomeController extends AbstractController {

  load() {
    const userPromise = this._userService.load(this.params.userId);

    return {
      user: userPromise
    };
  }
}
```

```javascript
// app/component/poll/PollExtension.js
export default class PollExtension extends AbstractExtension {
  getAllowedStateKeys() {
    return ['pollVotes'];
  }

  load() {
    const { user: userPromise } = this.getState();
    const pollVotesPromise = userPromise.then(
      user => this._pollService.getVotes(user.id)
    );

    return {
      pollVotes: pollVotesPromise
    };
  }
}
```

## State transactions

State transactions, similarly to SQL transactions, provide a way to queue state patches and then commit them as a one to the original state.

They're here for use cases where you'd in you workflow call `setState` method multiple times or you'd have to collect state patches in a separate variable (this is hard to do across multiple methods).

Transaction is initiated with `beginStateTransaction()` in Controller/Extension. After that
every setState call is queued and doesn't change the state or re-render anything. If there
is another transaction initiated before you commit you'll lost your patches.

If you want to see what changes are in queue from the begin of transaction call `getTransactionStatePatches()` method.

To finish the transaction you have to call `commitStateTransaction()` method. It will squash
all the patches made during the transaction into a one and apply it to the original state.
Therefore your application will re-render only once and you'll also receive [state events](/docs/events#stateeventsbefore_change_state) only once.

Another way to finish the transaction is to cancel it via `cancelStateTransaction()` method.

> **Note**: Call to `getState` method after the transaction has begun will return state as it was before the transaction eg. the returned state doesn't include changes from the transaction period until the transaction is commited.

```javascript
async onFormSubmit({ content, deleteRevisions = false }) {
  const { article } = this.getState();

  this.beginStateTransaction();

  const result = await this._http.put(/* ... */);

  if (deleteRevisions) {
    await this.deleteArtiacleRevisions();
  }

  this.setState({ article: Object.assign({}, article, { content }) });
  this.commitStateTransaction();
}

async deleteArtiacleRevisions() {
  const { article, revisions } = this.getState();

  await this._http.delete(/* ... */);

  this.setState({ revisions: [] });
}
```

In the example above, after the form is submitted with `deleteRevisions = true`:
 - Two `setState` calls are made
 - Only one render is triggered after the `commitStateTransaction` call
