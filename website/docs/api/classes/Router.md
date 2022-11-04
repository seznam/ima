---
id: "Router"
title: "Class: Router"
sidebar_label: "Router"
sidebar_position: 0
custom_edit_url: null
---

The router manages the application's routing configuration and dispatches
controllers and views according to the current URL and the route it matches.

## Hierarchy

- **`Router`**

  ↳ [`AbstractRouter`](AbstractRouter.md)

## Constructors

### constructor

• **new Router**()

## Methods

### add

▸ **add**(`name`, `pathExpression`, `controller`, `view`, `options`): [`Router`](Router.md)

Adds a new route to router.

**`Throws`**

Thrown if a route with the same name already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The unique name of this route, identifying it among        the rest of the routes in the application. |
| `pathExpression` | `string` | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        `:parameterName`. The name of the parameter is terminated        by a forward slash (`/`) or the end of the path expression        string.        The path expression may also contain optional parameters, which        are specified as `:?parameterName`. It is recommended to        specify the optional parameters at the end of the path        expression. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | The full name of Object Container alias        identifying the controller associated with this route. |
| `view` | `unknown` | The full name or Object Container alias identifying        the view class associated with this route. |
| `options` | `undefined` \| [`RouteOptions`](../modules.md#routeoptions) | Additional route options, specified how the navigation to the        route will be handled.        The `onlyUpdate` can be either a flag signalling whether        the current controller and view instances should be kept if they        match the ones used by the previous route; or a callback function        that will receive the previous controller and view identifiers        used in the previously matching route, and returns a        `boolean` representing the value of the flag. This flag is        disabled by default.        The `autoScroll` flag signals whether the page should be        scrolled to the top when the navigation takes place. This flag is        enabled by default.        The `allowSPA` flag can be used to make the route        always served from the server and never using the SPA page even        if the server is overloaded. This is useful for routes that use        different document views (specified by the `documentView`        option), for example for rendering the content of iframes.        The route specific `middlewares` which are run after        extracting parameters before route handling. |

#### Returns

[`Router`](Router.md)

This router.

#### Defined in

[packages/core/src/router/Router.ts:97](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L97)

___

### getBaseUrl

▸ **getBaseUrl**(): `string`

Returns the application's absolute base URL, pointing to the public root
of the application.

#### Returns

`string`

The application's base URL.

#### Defined in

[packages/core/src/router/Router.ts:166](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L166)

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

#### Defined in

[packages/core/src/router/Router.ts:204](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L204)

___

### getDomain

▸ **getDomain**(): `string`

Returns the application's domain in the following form
``${protocol}//${host}``.

#### Returns

`string`

The current application's domain.

#### Defined in

[packages/core/src/router/Router.ts:176](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L176)

___

### getHost

▸ **getHost**(): `string`

Returns application's host (domain and, if necessary, the port number).

#### Returns

`string`

The current application's host.

#### Defined in

[packages/core/src/router/Router.ts:185](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L185)

___

### getPath

▸ **getPath**(): `string`

Returns the current path part of the current URL, including the query
string (if any).

#### Returns

`string`

The path and query parts of the current URL.

#### Defined in

[packages/core/src/router/Router.ts:147](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L147)

___

### getProtocol

▸ **getProtocol**(): `string`

Returns the current protocol used to access the application, terminated
by a colon (for example `https:`).

#### Returns

`string`

The current application protocol used to access the
        application.

#### Defined in

[packages/core/src/router/Router.ts:196](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L196)

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

#### Defined in

[packages/core/src/router/Router.ts:137](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L137)

___

### getUrl

▸ **getUrl**(): `string`

Returns the current absolute URL (including protocol, host, query, etc).

#### Returns

`string`

The current absolute URL.

#### Defined in

[packages/core/src/router/Router.ts:156](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L156)

___

### handleError

▸ **handleError**(`params`, `options?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Handles an internal server error by responding with the appropriate
"internal server error" error page.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | Parameters extracted from        the current URL path and query. |
| `options?` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `locals?` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved when the error
        has been handled and the response has been sent to the client,
        or displayed if used at the client side.

#### Defined in

[packages/core/src/router/Router.ts:341](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L341)

___

### handleNotFound

▸ **handleNotFound**(`params`, `options?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Handles a "not found" error by responding with the appropriate "not
found" error page.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | Parameters extracted from        the current URL path and query. |
| `options?` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `locals?` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.

#### Defined in

[packages/core/src/router/Router.ts:363](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L363)

___

### init

▸ **init**(`config`): `void`

Initializes the router with the provided configuration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | Router configuration.        The `$Protocol` field must be the current protocol used to        access the application, terminated by a colon (for example        `https:`).        The `$Root` field must specify the URL path pointing to the        application's root.        The `$LanguagePartPath` field must be the URL path fragment        used as a suffix to the `$Root` field that specifies the        current language.        The `$Host` field must be the application's domain (and the        port number if other than the default is used) in the following        form: ``${protocol}//${host}``. |
| `config.$Host` | `string` | - |
| `config.$LanguagePartPath` | `string` | - |
| `config.$Protocol` | `string` | - |
| `config.$Root` | `string` | - |

#### Returns

`void`

#### Defined in

[packages/core/src/router/Router.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L46)

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

#### Defined in

[packages/core/src/router/Router.ts:380](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L380)

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

#### Defined in

[packages/core/src/router/Router.ts:391](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L391)

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

#### Defined in

[packages/core/src/router/Router.ts:299](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L299)

___

### listen

▸ **listen**(): [`Router`](Router.md)

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

[`Router`](Router.md)

This router.

#### Defined in

[packages/core/src/router/Router.ts:231](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L231)

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
| `action?` | `Record`<`string`, `unknown`\> | An action object describing what triggered this routing. |
| `locals?` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`void`

#### Defined in

[packages/core/src/router/Router.ts:278](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L278)

___

### remove

▸ **remove**(`name`): [`Router`](Router.md)

Removes the specified route from the router's known routes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The route's unique name, identifying the route to remove. |

#### Returns

[`Router`](Router.md)

This router.

#### Defined in

[packages/core/src/router/Router.ts:127](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L127)

___

### route

▸ **route**(`path`, `options?`, `action?`, `locals?`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

Routes the application to the route matching the providing path, renders
the route page and sends the result to the client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path part received from the client, with        optional query. |
| `options?` | [`RouteOptions`](../modules.md#routeoptions) | The options overrides route options defined in        the `routes.js` configuration file. |
| `action?` | `Record`<`string`, `unknown`\> | An action object describing what triggered this routing. |
| `locals?` | `Record`<`string`, `unknown`\> | The locals param is used to pass local data        between middlewares. |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.

#### Defined in

[packages/core/src/router/Router.ts:318](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L318)

___

### unlisten

▸ **unlisten**(): [`Router`](Router.md)

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

[`Router`](Router.md)

This router.

#### Defined in

[packages/core/src/router/Router.ts:252](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L252)

___

### use

▸ **use**(`middleware`): [`Router`](Router.md)

Adds a new middleware to router.

**`Throws`**

Thrown if a middleware with the same name already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | (`routeParams`: `RouteParams`, `locals`: `object`) => `unknown` | Middleware        function accepting routeParams as a first argument, which can be mutated        and `locals` object as second argument. This can be used to pass data        between middlewares. |

#### Returns

[`Router`](Router.md)

This router.

#### Defined in

[packages/core/src/router/Router.ts:117](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L117)
