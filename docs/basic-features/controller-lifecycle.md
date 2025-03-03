---
title: Controller lifecycle
description: Basic features > Controller lifecycle and it's API
---

IMA.js **AbstractController** provides a few methods you can implement in order to catch various lifecycle events and react to them. Each method description has *@server* or *@client* notation next to them symbolizing where the method is executed.

![](/img/docs/diagram-controller.png)


## `init()` *@server/client*

This is the first method that gets called in the lifecycle chain. Init method is substitution for native `constructor()` method. Route parameters are already set when this method is called.

## `load()` *@server/client*

Callback the controller uses to load all resources it needs to render a view.

The method must return a plain flat object that will be used to set the state of the controller. The field names of the object identify the resources being fetched and prepared, each value must be either the resource (e.g. view configuration or a value retrieved synchronously) or a `Promise` that will resolve to the resource.

`Promise`s are handled differently when rendering on the server side or the client side.

- At the **server side**, the IMA will wait for all the promises to resolve, then replace the promises with the resolved values and sets the resulting object as the controller's state. Even though promises are resolved in parallel it's a good practice to keep their number on minimum because their resolution is blocking sending the response to the client.

- At the **client side**, the IMA.js will first set the controller's state to
an object containing only the fields of the returned object that were
**not promises**. IMA will then update the controller's state every time a
promise of the returned object resolves.

Any returned promise that gets **rejected** will redirect the application to
the error page. The error page that will be used depends on the status
code of the error.

Since **v17** you can use `async/await` instead of promises. This means the `load` method will have **async** prefix and resources will be loaded synchronously using **await** keyword.

```javascript
async load() {
  const user = await this._userService.getById(this.params.userId);
  const comments = await this._commentService.list({ userId: user.id });

  return {
    user,
    comments
  };
}
```

This functionality has its pros and cons. Main contradiction would be synchronous loading and thus response time increase. A lot of requests can happen independently on each other and save some of the response time. In this case it's better to combine promises and `async/await` to achieve best performance.

```javascript
async load() {
  const userPromise = this._userService.getById(this.params.userId); // load parallel to article and comments
  const article = await this._articleService.get(this.params.articleUrl);
  let comments = [];

  if (article.commentsCount && article.commentsAllowed) {
    comments = await this._commentService.list({ articleId: article.id });
  }

  return { article, comments, user: userPromise };
}
```

A benefit to using **async/await** is simplicity and better handling of data. Imagine you have a request that loads 2 resources and you want to add these resources to page state. When using promises this would be impossible as promises must return single value and we're returning the promise itself not the resolved value.

```javascript
async load() {
  const checkoutData = await this._checkoutService.getByCookie();
  const { items, payment, shipping } = checkoutData;

  return {
    cartItems: items,
    paymentDetails: payment,
    shippingDetail: shipping
  };
}
```

## `setMetaParams()` *@server/client*

Callback used to configure the meta attribute manager. The method is
called after the controller's state has been patched with the all
loaded resources from the [`load()`](#load-serverclient) method and the view has been rendered.

`setMetaParams()` method receives following arguments:
- **loadedResources** - A plain object representing a map of resource names to resources loaded by the [`load()`](#load-serverclient) method. This is the same object as the one passed to the `setState()` method.
- **metaManager** - Meta attributes manager instance to configure (See [SEO & MetaManager](./seo-and-meta-manager) page).
- **router** - The current application router.
- **dictionary** - The current localization dictionary
- **settings** - The application settings for the current application environment.

## `activate()` *@client*

Callback for activating the controller when the **route updated** to one of those that are associated with the controller or the controller is **revived** at the client side.

This method is the last method invoked during controller initialization. `activate()` is called after all the promises returned from the [`load()`](#load-serverclient) method have been resolved and the controller has configured the meta manager.

When reviving the state from the **server side** all promises are resolved and meta values set, therefore the controller state is fully complete.

This method is a good place to register any React and DOM event listeners. The controller may start receiving event bus event after this method completes.

## `update()` *@client*

Callback for updating the controller after a route update. This method
is invoked if the current [route has the `onlyUpdate = true` flag set](./routing/introduction.md#onlyupdate) and the current controller and view match those used by the previously active route, or, the `onlyUpdate` option of the current route is a callback and returned `true`.

The method must return an object with the same semantics as the result
of the [`load()`](#load-serverclient) method. The controller's state will only be
patched by the returned object instead of replacing it completely.

The other controller lifecycle callbacks ([`init()`](#init--serverclient), [`load()`](#load-serverclient), [`activate()`](#activate--client), [`deactivate()`](#deactivate--client), [`destroy()`](#destroy--client)) are not call in case this method is used.

`update()` method receives argument **prevParams**; an object containing previous route parameters.

## `deactivate()` *@client*

Callback for deactivating the controller. This is the first
method invoked during controller deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the [`activate()`](#activate--client) method. When the [`activate()`](#activate--client) method has not been called `deactivate()` won't be called either.

The controller should deregister listeners and release all
resources obtained in the [`activate()`](#activate--client) method.

## `destroy()` *@client*

Finalization callback, called when the controller is being discarded by the application. This usually happens when the user navigates to a different URL.

This method is the lifecycle counterpart of the [`init()`](#init--serverclient) method.

The controller should release all resources obtained in the [`init()`](#init--serverclient) method. The controller must release any resources that might not be released automatically when the controller's instance
is destroyed by the garbage collector.
