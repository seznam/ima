---
layout: "docs"
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



