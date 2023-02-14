---
title: SEO & Meta Manager
description: Basic features > SEO & Meta Manager
---

If you've read the [Controller lifecycle](./controller-lifecycle) page you've
probably come along the [`setMetaParams`](./controller-lifecycle.md#setmetaparams-serverclient)
method. This method is dedicated to set meta information for a specific
page and you are provided with everything you need *(current state, MetaManager,
router, dictionary and settings)*.

Meta manager offers many methods to work with document meta data. From `#{meta}` content variable, to methods for managing **title** and other **meta** tags collections.

## Managing meta tags

As mentioned above, all meta management is done in `setMetaParams` method in **route controller**. Using `metaManager` and provied setters for **title**, **meta name**, **meta properties** and **link** collections, you can manage contents of your meta tags easily with the help of additional arguments that provide everything you need (current state, MetaManager, router, dictionary and settings).

```javascript title=./app/page/order/OrderController.js
setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { order } = loadedResources;

  metaManager.setTitle(`Order #${order.id} - ${settings.general.appTitle}`);
  metaManager.setMetaName(
    'description',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  );

  metaManager.setMetaProperty('og:image', order.thumbnailUrl);

  const orderDetailLink = router.link('order-detail', {
    orderId: order.id
  });

  metaManager.setLink('canonical', orderDetailLink);
}
```

:::info

`undefined` and `null` values are filtered out when rendering meta tags. If you still want to render meta tags with empty values, use empty strings `''`.

:::

### setTitle()
> `(title: string) => MetaManager`

Use to set document title.

### setMetaName()
> `(name: string, content: MetaValue, attr?: MetaAttributes) => MetaManager`

Sets the information to be used in `<meta name="..." content="..." />`.

### setMetaProperty()
> `(name: string, property: MetaValue, attr?: MetaAttributes) => MetaManager`

These methods are similar to the two above except that these are used for `<meta property="..." content="..." />`.

### setLink()
> `(relation: string, href: MetaValue, attr?: MetaAttributes) => MetaManager`

Adds information to the MetaManager to be later used in `<link rel="..." href="..." />` tag.

:::tip

All 3 methods defined above also supports additional optional attributes. This is an object of key-value pairs representing additional meta tag attributes that are used in certain situations.

```js

metaManager.setMetaProperty('og:image', order.thumbnailUrl, {
  size: 'large',
  authorUrl: 'https://mysite.com'
});

```

:::

## Meta value getters

Each setter has corresponding getter returning and object with key-value pairs representing the meta tag values. Additionally you can use key and value iterator methods.

 - `getTitle()`
 - `getMetaName()`, `getMetaNames()`, `getMetaNamesIterator()`
 - `getMetaProperty()`, `setMetaProperties()`, `setMetaPropertiesIterator()`
 - `getLink()`, `getLinks()`, `getLinksIterator()`

:::tip

Since the getter methods return object with key-value attributes where their names correspond to the html tag attribute name, you can use following shortcuts to render (these include optional attributes):

```jsx
<meta
  property="og:image"
  {...this.props.metaManager.getMetaProperty('og:image')}
/>
<meta
  link="canonical"
  {...this.props.metaManager.getLink('canonical')}
/>
```

:::

## Rendering meta tags

Meta tags are handled differently on server an client, see following sections for more information on this matter.

### Rendering on server using the `#{meta}` content variable

While you can manually render meta tags in the document view using `metaManger` and any of the provided getter methods or iterators, we also render these tags automatically into `#{meta}` content variable.

You can then use this content variable in `DocumentView` to easily render whole meta collection (including **document title**) matching meta information set for current controller in `setMetaParams` method.

```jsx title=./app/document/DocumentView.jsx
<head>
  // highlight-next-line
  {'#{meta}'}
  {'#{styles}'}
  {'#{revivalSettings}'}
  {'#{runner}'}
</head>
```

:::note

While you can also use this content variable in `spa.ejs`, it will always be empty, since client rendering is handled separately. See the [next section](#rendering-on-client-using-pagemetahandler) for more information.

:::

### Rendering on client using `PageMetaHandler`

You may have noticed that the server-side rendered meta tags have `data-ima-meta` data attribute. This **serves as an identification for meta tags that are handled by IMA.js** (both on server and client). These also correspond to the values you have set using `metaManager` setters.

```html
<meta data-ima-meta name="twitter:title" content="IMA.js">
```

While navigating between pages in SPA, the meta tags are** updated automatically** using `PageMetaHandler`. This manager always **removes old meta tags** identified by the data attribute, before rendering new ones. And since `metaManager` clears it's meta collection between routes, this means that each page renders only those tags that are set in `metaManager` in current page controller using `setMetaParams` method.

### Global meta tags

Now that you know how IMA.js handles meta tag updates between routes, you may ask yourself a question "how to handle global meta tags like `viewport`, `charset` etc.?"

The solution is pretty simple - just define them in `DocumentView` and `spa.ejs` templates, tags that don't have `data-ima-meta` attribute are not touched at all by the `PageMetaHandler`.

```jsx title=./app/document/DocumentView.jsx
<head>
  // highlight-next-line
  <meta charSet='utf-8' />
  // highlight-next-line
  <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
  // highlight-next-line
  <meta name='viewport' content='width=device-width, initial-scale=1' />
</head>
```

Alternative solution is to always set these values in every page controller you have. For this you can use helpers or create custom `AbstractController`.
