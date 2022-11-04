---
id: "AbstractRouter"
title: "Class: AbstractRouter"
sidebar_label: "AbstractRouter"
sidebar_position: 0
custom_edit_url: null
---

The basic implementation of the [Router](Router.md) interface, providing the
common or default functionality for parts of the API.

## Hierarchy

- [`Router`](Router.md)

  ↳ **`AbstractRouter`**

  ↳↳ [`ClientRouter`](ClientRouter.md)

  ↳↳ [`ServerRouter`](ServerRouter.md)

## Constructors

### constructor

• **new AbstractRouter**(`pageManager`, `factory`, `dispatcher`)

Initializes the router.

**`Example`**

```ts
router.link('article', {articleId: 1});
```

**`Example`**

```ts
router.redirect('http://www.example.com/web');
```

**`Example`**

```ts
router.add(
       'home',
       '/',
       ns.app.page.home.Controller,
       ns.app.page.home.View,
       {
         onlyUpdate: false,
         autoScroll: true,
         documentView: null,
         managedRootView: null,
         viewAdapter: null
       }
     );
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pageManager` | [`PageManager`](PageManager.md) | The page manager handling UI rendering,        and transitions between pages if at the client side. |
| `factory` | [`RouteFactory`](RouteFactory.md) | Factory for routes. |
| `dispatcher` | [`Dispatcher`](Dispatcher.md) | Dispatcher fires events to app. |

#### Overrides

[Router](Router.md).[constructor](Router.md#constructor)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:91](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L91)

## Properties

### \_currentMiddlewareId

• `Protected` **\_currentMiddlewareId**: `number` = `0`

Middleware ID counter which is used to auto-generate unique middleware
names when adding them to routeHandlers map.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:62](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L62)

___

### \_currentlyRoutedPath

• `Protected` **\_currentlyRoutedPath**: `string` = `''`

#### Defined in

[packages/core/src/router/AbstractRouter.ts:63](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L63)

___

### \_dispatcher

• `Protected` **\_dispatcher**: [`Dispatcher`](Dispatcher.md)

Dispatcher fires events to app.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L34)

___

### \_factory

• `Protected` **\_factory**: [`RouteFactory`](RouteFactory.md)

Factory for routes.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:30](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L30)

___

### \_host

• `Protected` **\_host**: `string` = `''`

The application's host.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L43)

___

### \_languagePartPath

• `Protected` **\_languagePartPath**: `string` = `''`

The URL path fragment used as a suffix to the `_root` field
that specifies the current language.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L52)

___

### \_pageManager

• `Protected` **\_pageManager**: [`PageManager`](PageManager.md)

The page manager handling UI rendering, and transitions between
pages if at the client side.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L26)

___

### \_protocol

• `Protected` **\_protocol**: `string` = `''`

The current protocol used to access the application, terminated by a
colon (for example `https:`).

#### Defined in

[packages/core/src/router/AbstractRouter.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L39)

___

### \_root

• `Protected` **\_root**: `string` = `''`

The URL path pointing to the application's root.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:47](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L47)

___

### \_routeHandlers

• `Protected` **\_routeHandlers**: `Map`<`string`, `default` \| [`AbstractRoute`](AbstractRoute.md)\>

Storage of all known routes and middlewares. The key are their names.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:56](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L56)

## Methods

### \_addParamsFromOriginalRoute

▸ **_addParamsFromOriginalRoute**(`params`): `RouteParams`

Obtains original route that was handled before not-found / error route
and assigns its params to current params

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | Route params for not-found or        error page |

#### Returns

`RouteParams`

Provided params merged with params
       from original route

#### Defined in

[packages/core/src/router/AbstractRouter.ts:623](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L623)

___

### \_extractRoutePath

▸ `Protected` **_extractRoutePath**(`path`): `string`

Strips the URL path part that points to the application's root (base
URL) from the provided path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | Relative or absolute URL path. |

#### Returns

`string`

URL path relative to the application's base URL.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:459](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L459)

___

### \_getCurrentlyRoutedPath

▸ **_getCurrentlyRoutedPath**(): `string`

Returns path that is stored in private property when a `route`
method is called.

#### Returns

`string`

#### Defined in

[packages/core/src/router/AbstractRouter.ts:587](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L587)

___

### \_getMiddlewaresForRoute

▸ **_getMiddlewaresForRoute**(`routeName`): `default`[]

Returns middlewares preceding given route name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeName` | `string` |

#### Returns

`default`[]

#### Defined in

[packages/core/src/router/AbstractRouter.ts:565](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L565)

___

### \_getRouteHandlersByPath

▸ **_getRouteHandlersByPath**(`path`): `Object`

Returns the route matching the provided URL path part (the path may
contain a query) and all middlewares preceding this route definition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path. |

#### Returns

`Object`

The route
        matching the path and middlewares preceding it or `{}`
        (empty object) if no such route exists.

| Name | Type |
| :------ | :------ |
| `middlewares` | `default`[] |
| `route?` | [`AbstractRoute`](AbstractRoute.md) |

#### Defined in

[packages/core/src/router/AbstractRouter.ts:538](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L538)

___

### \_handle

▸ **_handle**(`route`, `params`, `options`, `action?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Handles the provided route and parameters by initializing the route's
controller and rendering its state via the route's view.

The result is then sent to the client if used at the server side, or
displayed if used as the client side.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `route` | [`AbstractRoute`](AbstractRoute.md) | The route that should have its        associated controller rendered via the associated view. |
| `params` | `RouteParams` | Parameters extracted from        the URL path and query. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in the        `routes.js` configuration file. |
| `action` | `Object` | An action        object describing what triggered this routing. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise that resolves when the
        page is rendered and the result is sent to the client, or
        displayed if used at the client side.

#### Defined in

[packages/core/src/router/AbstractRouter.ts:482](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L482)

___

### \_runMiddlewares

▸ **_runMiddlewares**(`middlewares`, `params`, `locals`): `Promise`<`void`\>

Runs provided middlewares in sequence.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middlewares` | `default`[] | Array of middlewares. |
| `params` | `RouteParams` | Router params that can be        mutated by middlewares. |
| `locals` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/router/AbstractRouter.ts:600](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L600)

___

### add

▸ **add**(`name`, `pathExpression`, `controller`, `view`, `options?`): [`AbstractRouter`](AbstractRouter.md)

Adds a new route to router.

**`Throws`**

Thrown if a route with the same name already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The unique name of this route, identifying it among        the rest of the routes in the application. |
| `pathExpression` | `string` | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        `:parameterName`. The name of the parameter is terminated        by a forward slash (`/`) or the end of the path expression        string.        The path expression may also contain optional parameters, which        are specified as `:?parameterName`. It is recommended to        specify the optional parameters at the end of the path        expression. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | The full name of Object Container alias        identifying the controller associated with this route. |
| `view` | `string` \| `object` \| () => `unknown` | The full name or Object Container alias identifying        the view class associated with this route. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | Additional route options, specified how the navigation to the        route will be handled.        The `onlyUpdate` can be either a flag signalling whether        the current controller and view instances should be kept if they        match the ones used by the previous route; or a callback function        that will receive the previous controller and view identifiers        used in the previously matching route, and returns a        `boolean` representing the value of the flag. This flag is        disabled by default.        The `autoScroll` flag signals whether the page should be        scrolled to the top when the navigation takes place. This flag is        enabled by default.        The `allowSPA` flag can be used to make the route        always served from the server and never using the SPA page even        if the server is overloaded. This is useful for routes that use        different document views (specified by the `documentView`        option), for example for rendering the content of iframes.        The route specific `middlewares` which are run after        extracting parameters before route handling. |

#### Returns

[`AbstractRouter`](AbstractRouter.md)

This router.

#### Overrides

[Router](Router.md).[add](Router.md#add)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:124](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L124)

___

### getBaseUrl

▸ **getBaseUrl**(): `string`

Returns the application's absolute base URL, pointing to the public root
of the application.

#### Returns

`string`

The application's base URL.

#### Overrides

[Router](Router.md).[getBaseUrl](Router.md#getbaseurl)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:199](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L199)

___

### getCurrentRouteInfo

▸ **getCurrentRouteInfo**(): `Object`

Returns the information about the currently active route.

**`Throws`**

Thrown if a route is not define for current path.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `params` | `RouteParams` |
| `path` | `string` |
| `route` | [`AbstractRoute`](AbstractRoute.md) |

#### Overrides

[Router](Router.md).[getCurrentRouteInfo](Router.md#getcurrentrouteinfo)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:227](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L227)

___

### getDomain

▸ **getDomain**(): `string`

Returns the application's domain in the following form
``${protocol}//${host}``.

#### Returns

`string`

The current application's domain.

#### Overrides

[Router](Router.md).[getDomain](Router.md#getdomain)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:206](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L206)

___

### getHost

▸ **getHost**(): `string`

Returns application's host (domain and, if necessary, the port number).

#### Returns

`string`

The current application's host.

#### Overrides

[Router](Router.md).[getHost](Router.md#gethost)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:213](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L213)

___

### getPath

▸ **getPath**(): `string`

Returns the current path part of the current URL, including the query
string (if any).

#### Returns

`string`

The path and query parts of the current URL.

#### Overrides

[Router](Router.md).[getPath](Router.md#getpath)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:183](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L183)

___

### getProtocol

▸ **getProtocol**(): `string`

Returns the current protocol used to access the application, terminated
by a colon (for example `https:`).

#### Returns

`string`

The current application protocol used to access the
        application.

#### Overrides

[Router](Router.md).[getProtocol](Router.md#getprotocol)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:220](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L220)

___

### getRouteHandler

▸ **getRouteHandler**(`name`): `undefined` \| `default` \| [`AbstractRoute`](AbstractRoute.md)

Returns specified handler from registered route handlers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The route's unique name. |

#### Returns

`undefined` \| `default` \| [`AbstractRoute`](AbstractRoute.md)

Route with given name or undefined.

#### Overrides

[Router](Router.md).[getRouteHandler](Router.md#getroutehandler)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:176](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L176)

___

### getUrl

▸ **getUrl**(): `string`

Returns the current absolute URL (including protocol, host, query, etc).

#### Returns

`string`

The current absolute URL.

#### Overrides

[Router](Router.md).[getUrl](Router.md#geturl)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:192](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L192)

___

### handleError

▸ **handleError**(`params`, `options?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Handles an internal server error by responding with the appropriate
"internal server error" error page.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | Parameters extracted from        the current URL path and query. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `locals` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved when the error
        has been handled and the response has been sent to the client,
        or displayed if used at the client side.

#### Overrides

[Router](Router.md).[handleError](Router.md#handleerror)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:339](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L339)

___

### handleNotFound

▸ **handleNotFound**(`params`, `options?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Handles a "not found" error by responding with the appropriate "not
found" error page.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | Parameters extracted from        the current URL path and query. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `locals` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.

#### Overrides

[Router](Router.md).[handleNotFound](Router.md#handlenotfound)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:386](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L386)

___

### init

▸ **init**(`config`): `void`

Initializes the router with the provided configuration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | Router configuration.        The `$Protocol` field must be the current protocol used to        access the application, terminated by a colon (for example        `https:`).        The `$Root` field must specify the URL path pointing to the        application's root.        The `$LanguagePartPath` field must be the URL path fragment        used as a suffix to the `$Root` field that specifies the        current language.        The `$Host` field must be the application's domain (and the        port number if other than the default is used) in the following        form: ``${protocol}//${host}``. |
| `config.$Host` | `string` | - |
| `config.$LanguagePartPath?` | `string` | - |
| `config.$Protocol?` | `string` | - |
| `config.$Root?` | `string` | - |

#### Returns

`void`

#### Overrides

[Router](Router.md).[init](Router.md#init)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:108](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L108)

___

### isClientError

▸ **isClientError**(`reason`): `boolean`

Tests, if possible, whether the specified error was caused by the
client's action (for example wrong URL or request encoding) or by a
failure at the server side.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason` | `Error` \| [`GenericError`](GenericError.md) | The encountered error. |

#### Returns

`boolean`

`true` if the error was caused the action of the
        client.

#### Overrides

[Router](Router.md).[isClientError](Router.md#isclienterror)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:432](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L432)

___

### isRedirection

▸ **isRedirection**(`reason`): `boolean`

Tests, if possible, whether the specified error lead to redirection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason` | `Error` \| [`GenericError`](GenericError.md) | The encountered error. |

#### Returns

`boolean`

`true` if the error was caused the action of the
        redirection.

#### Overrides

[Router](Router.md).[isRedirection](Router.md#isredirection)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:443](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L443)

___

### link

▸ **link**(`routeName`, `params`): `string`

Generates an absolute URL (including protocol, domain, etc) for the
specified route by substituting the route's parameter placeholders with
the provided parameter values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routeName` | `string` | The unique name of the route, identifying the        route to use. |
| `params` | `RouteParams` | Parameter values for the route's        parameter placeholders. Extraneous parameters will be added as        URL query. |

#### Returns

`string`

An absolute URL for the specified route and parameters.

#### Overrides

[Router](Router.md).[link](Router.md#link)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:282](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L282)

___

### listen

▸ **listen**(): [`AbstractRouter`](AbstractRouter.md)

Registers event listeners at the client side window object allowing the
router to capture user's history (history pop state - going "back") and
page (clicking links) navigation.

The router will start processing the navigation internally, handling the
user's navigation to display the page related to the URL resulting from
the user's action.

Note that the router will not prevent forms from being submitted to the
server.

The effects of this method can be reverted with `unlisten`. This
method has no effect at the server side.

#### Returns

[`AbstractRouter`](AbstractRouter.md)

This router.

#### Overrides

[Router](Router.md).[listen](Router.md#listen)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:250](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L250)

___

### redirect

▸ **redirect**(`url`, `options?`, `action?`, `locals?`): `void`

Redirects the client to the specified location.

At the server side the method results in responding to the client with a
redirect HTTP status code and the `Location` header.

At the client side the method updates the current URL by manipulating
the browser history (if the target URL is at the same domain and
protocol as the current one) or performs a hard redirect (if the target
URL points to a different protocol or domain).

The method will result in the router handling the new URL and routing
the client to the related page if the URL is set at the client side and
points to the same domain and protocol.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the client should be redirected. |
| `options?` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `action?` | `Object` | An action object describing what triggered this routing. |
| `action.event?` | `Event` | - |
| `action.payload?` | `object` \| `Event` | - |
| `action.type?` | `string` | - |
| `locals?` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`void`

#### Overrides

[Router](Router.md).[redirect](Router.md#redirect)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:268](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L268)

___

### remove

▸ **remove**(`name`): [`AbstractRouter`](AbstractRouter.md)

Removes the specified route from the router's known routes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The route's unique name, identifying the route to remove. |

#### Returns

[`AbstractRouter`](AbstractRouter.md)

This router.

#### Overrides

[Router](Router.md).[remove](Router.md#remove)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:167](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L167)

___

### route

▸ **route**(`path`, `options?`, `action?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Routes the application to the route matching the providing path, renders
the route page and sends the result to the client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path part received from the client, with        optional query. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `action` | `Object` | An action object describing what triggered this routing. |
| `action.event?` | `Event` | - |
| `action.type?` | `string` | - |
| `action.url?` | `string` | - |
| `locals` | `Object` | The locals param is used to pass local data        between middlewares. |
| `locals.action?` | `Record`<`string`, `unknown`\> | - |
| `locals.route?` | [`AbstractRoute`](AbstractRoute.md) | - |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.

#### Overrides

[Router](Router.md).[route](Router.md#route)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:298](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L298)

___

### unlisten

▸ **unlisten**(): [`AbstractRouter`](AbstractRouter.md)

Unregisters event listeners at the client side window object allowing the
router to capture user's history (history pop state - going "back") and
page (clicking links) navigation.

The router will stop processing the navigation internally, handling the
user's navigation to display the page related to the URL resulting from
the user's action.

Note that the router will not prevent forms from being submitted to the
server.

The effects of this method can be reverted with `unlisten`. This method has no effect
at the server side.

#### Returns

[`AbstractRouter`](AbstractRouter.md)

This router.

#### Overrides

[Router](Router.md).[unlisten](Router.md#unlisten)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:259](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L259)

___

### use

▸ **use**(`middleware`): [`AbstractRouter`](AbstractRouter.md)

Adds a new middleware to router.

**`Throws`**

Thrown if a middleware with the same name already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | (`params`: `RouteParams`, `locals`: `object`) => `unknown` | Middleware        function accepting routeParams as a first argument, which can be mutated        and `locals` object as second argument. This can be used to pass data        between middlewares. |

#### Returns

[`AbstractRouter`](AbstractRouter.md)

This router.

#### Overrides

[Router](Router.md).[use](Router.md#use)

#### Defined in

[packages/core/src/router/AbstractRouter.ts:155](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRouter.ts#L155)
