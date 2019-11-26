---
layout: "docs"
---

# Object Container

---

The **Object Container (OC)** is an enhanced dependency injector with support 
for aliases and constants. It is sophisticated and registers everything it comes across but only if it actually matters. For example it registers only **Controllers** and **Views** that you use in `app/config/routes.js`. 

By registering controllers and views the OC can simply follow your dependency tree and register everything you might possibly need. Below is a diagram of simple dependency tree.

```
app/config/routes.js
├─ OrderController
|   ├─ OrderService / OrderEntity
|   |   └─ RestClient
|   |     ├─ $HttpAgent
|   |     ├─ $Cache
|   |     └─ LinkGenerator
|   |       └─ $Router
|   └─ UserService / UserEntity
|     └─ RestClient
|       ├─ $HttpAgent
|       ├─ $Cache
|       └─ LinkGenerator
|         └─ $Router
└─ UserController
  ├─ ...
  └─ ...
```

## Manually registering dependencies

Since the OC cannot discover everything and doesn't know about interfaces you can register your dependencies in a file `app/config/bind.js`.
This file contains a function that receives the namespace register 
*(deprecated)*, OC instance and a config object.

```javascript
// app/config/bind.js
export let init = (ns, oc, config) => {
  // Register stuff here
}
```

Below is list of methods that the OC provides to register your dependencies.

> **Note:** Every method returns the OC itself so you can chain them together.

### 1. `bind()`

Binds the specified class or factory function and dependencies to the 
specified alias.
This allows to create new instances of the class or the 
function by referencing the alias. Same goes for specifying the class of 
the function as a dependency.

Also note that the same class or function may be bound to several
aliases and each may use different dependencies.

The alias will use the current dependencies bound to the class if no
dependencies are provided.

```javascript
// app/config/bind.js
//
// Binding custom router implementation and 
// UserAgent class from IMA.js user-agent plugin

import { UserAgent } from '@ima/plugin-useragent';
import { CustomRouter } from 'app/your-custom-overrides/Router';

export let init = (ns, oc, config) => {
  // Simple alias
  oc.bind('UserAgent', UserAgent);

  // Alias with dependencies
  // Override of the IMA.js router implementation
  oc.bind('$Router', CustomRouter, [
      '$PageManager', '$RouteFactory', '$Dispatcher', Window
  ]);

  // ...
}
```

> **Note:** The dollar-sign `$` at the beginning of an alias marks IMA.js 
internal component.

### 2. `constant()`

Defines a new constant registered within the OC. Note that
this is the only way of passing `string` values to constructors
because the OC treats strings as class, interface, alias
or constant names. Once the constant is defined it cannot be redefined.

```javascript
// app/config/bind.js
//
// Assigning API root URL to a constant that can be later used as a dependency 
// (for example in IMA.js RestAPI client)

export let init = (ns, oc, config) => {
  oc.constant('REST_API_ROOT_URL', config.api.url);
}
```

> **Note:** Constants are not limited to primitive values but can also 
take objects.

### 3. `inject()`

Configures the object loader with the specified default dependencies for 
the specified class.
   
New instances of the class created by the OC will receive the provided 
dependencies into constructor unless custom dependencies are provided.

```javascript
// app/config/bind.js
//
// Injecting the rest client. 
// Notice how we used the REST_API_ROOT_URL constant

import Cache from 'ima/cache/Cache';
import HttpAgent from 'ima/http/HttpAgent';
import SimpleRestClient from 'app/rest-client-impl/SimpleRestClient';
import LinkGenerator from 'app/rest-client-impl/LinkGenerator';

export let init = (ns, oc, config) => {
  oc.inject(SimpleRestClient, [
    HttpAgent, Cache, 'REST_API_ROOT_URL', LinkGenerator
  ]);
}
```

> **Note:** For more information about the IMA.js REST Client see [IMA-plugin-rest-client](https://github.com/jurca/IMA-plugin-rest-client) repository.

### 4. `provide()`

Configures the default implementation of the specified interface. 
When the interface is requested from the OC the default implementation
is provided.

The implementation constructor will obtain the provided default
dependencies or the dependencies provided to the [`create()`](#3-create) method.

```javascript
// app/config/bind.js
//
// 

import { AbstractRestClient } from 'ima-plugin-rest-client';
import SimpleRestClient from 'app/rest-client-impl/SimpleRestClient';

export let init = (ns, oc, config) => {
  oc.provide(AbstractRestClient, SimpleRestClient);

  // We didn't specify any dependencies on purpose 
  // they were set in the previous example.
  // Otherwise it would be like this:

  oc.provide(
    AbstractRestClient, 
    SimpleRestClient,
    [
      HttpAgent, Cache, 'REST_API_ROOT_URL', LinkGenerator
    ]
  );
}
```


## Obtaining dependencies

In IMA.js application you can obtain dependencies using many different methods, where each one can be useful in different situation and environment.

### 1. Dependency Injection

Apart from defining dependencies manually in `app/config/bind.js` can every class (discovered by the OC) define a static getter `$dependencies`. This getter should return list of dependencies specified by a class constructor or a `string` alias.

```javascript
// app/page/order/OrderController.js
//
// OrderController is discovered by the OC
// because it's registered in app/config/routes.js

import { AbstractController } from '@ima/core';
import OrderService from 'app/model/order/OrderService.js';
import UserService from 'app/model/user/UserService.js';

export default class OrderController extends AbstractController {

  static get $dependencies() {
    return [
      OrderService,
      UserService,
      '$Router'
    ];
  }

  // ...
```

Once you've defined the dependencies the constructor of the class will receiver their instances.

```javascript
  constructor(orderService, userService, $router) {
    super();

    this._orderService = orderService;
    this._userService = userService;
    this._$router = $router;
  }

  // ...
```

### 2. `get()`

Retrieves the **shared instance** or value of the specified constant, alias,
class or factory function, interface, or fully qualified namespace path
(the method checks these in this order in case of a name clash).

The instance or value is created lazily the first time it is requested.

```javascript
oc.get('REST_API_ROOT_URL');
oc.get('UserAgent');
oc.get(AbstractRestClient); // This returns instance of `SimpleRestClient` as we defined in the previous example
```

### 3. `create()`

Creates a **new instance** of the class or retrieves the value generated by
the factory function identified by the provided name, class, interface,
or factory function, passing in the provided dependencies.

The method uses the dependencies specified when the class, interface or
factory function has been registered with the object container if no
custom dependencies are provided.

```javascript
import { Cache, HttpAgent } from '@ima/core';
import SimpleRestClient from 'app/rest-client-impl/SimpleRestClient';
import LinkGenerator from 'app/rest-client-impl/LinkGenerator';

oc.create('UserAgent');
oc.create(
  SimpleRestClient, 
  [
    HttpAgent, Cache, 'REST_API_ROOT_URL', LinkGenerator
  ]
);
```

The last two method are not used as much as the first one but can be 
useful inside the `app/config/bind.js` and `app/config/routes.js`

## Other methods

- `has()` returns `true` if the specified object, class or resource is registered 
within the OC.

```javascript
if (oc.has('UserAgent') && oc.get('UserAgent').isMobile()) {
  // Register conditional stuff here...
}
```

- `getConstructorOf()` returns the class constructor function of the specified class or alias.
