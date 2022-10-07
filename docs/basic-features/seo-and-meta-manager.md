---
title: SEO & Meta Manager
description: Basic features > SEO & Meta Manager
---

If you've read the [Controller lifecycle](./controller-lifecycle) page you've
probably come along the [`setMetaParams`](./controller-lifecycle.md#setmetaparams-serverclient)
method. This method is dedicated to set meta information for a specific
page and you are provided with everything you need *(current state, MetaManager,
router, dictionary and settings)*.

**MetaManager** is then used in [DocumentView](./rendering-process#documentview) to
set `<title/>`, `<meta/>` and `<link/>` tags.

## Setting and obtaining information from the MetaManager

Meta manager offers many methods to work with document meta data, we're going to describe each one in
few following sections.


## Global meta tags

If you want to define **static** meta or link tags for **each route** you should explicitly render them in your `DocumentView`.


```jsx
// app/component/document/DocumentView.jsx

render() {
  return (
    <html>
      <head>
        <link href="/my-awesome-stylesheet.css" rel="stylesheet"> 
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  );
}
```

## Route-specific meta tags

The following snippet is included in your `DocumentView` by default. It dynamically renders your page-specific meta tags
and title described in `setMetaParams` controller method.

```jsx
// app/component/document/DocumentView.jsx`

// in the beginning of render() method
const { metaManager } = this.props;

// ...
<head>
  {metaManager.getMetaNames().map(name => (
    <meta
      key={name}
      name={name}
      {...metaManager.getMetaName(name)}
      data-ima-meta
    />
  ))}
  {metaManager.getMetaProperties().map(property => (
    <meta
      key={property}
      property={property}
      {...metaManager.getMetaProperty(property)}
      data-ima-meta
    />
  ))}
  {metaManager.getLinks().map(rel => (
    <link
      key={rel}
      rel={rel}
      {...metaManager.getLink(rel)}
      data-ima-meta
    />
  ))}
  <title>{metaManager.getTitle()}</title>
</head>
```

:::caution

Dynamically rendered meta tags managed by IMA use `data-ima-meta` attribute. The meta tags won't by synced with route changes if they don't have the attribute set.

:::

Use the following four methods to control which meta tags should be rendered by the snippet. All of the methods accept a unique identifier
as a first argument, value as a second and an object as a third. The `value` argument will be used for the correct primary attribut of the element
(`content` for `<meta/>` and `href` for `<link/>`).

### Managing document title - `setTitle()`

Sets the page title...

```javascript
// app/page/order/OrderController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { order } = loadedResources;
  const title = `Order #${order.id} - ${settings.general.appTitle}`
  metaManager.setTitle(title);
}
```

### Configuring meta tags - `setMetaName()`

Sets the information to be used in `<meta name="..." content="..."/>`.

```javascript
// app/page/BaseController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  metaManager.setMetaName(
    'description',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  );
  metaManager.setMetaName(
    'image',
    '/awesome-img.png',
    { 'data-size': 'large', id: 'custom-meta-tag-id' }
  )
}
```

The `name` attribute of the `<meta/>` tag should match the 1st
argument of the `setMetaName()` method otherwise the contents won't be updated.

### Configuring meta properties - `setMetaProperty()`

These methods are similar to the two above except that these are used for
`<meta property="..." content="..."/>`.

```javascript
// app/page/ArticleController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { article } = loadedResources;
  metaManager.setMetaProperty('og:image', article.thumbnailUrl);
}
```

Again, the `property` attribute of the `<meta>` tag should match the 1st
argument of the `setMetaProperty()` method otherwise the contents won't be updated.

### Configuring links - `setLink()`

Adds information to the MetaManager to be later used in
`<link rel="..." href="..." />` tag.

```javascript
// app/page/order/OrderController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { order } = loadedResources;
  const orderDetailLink = router.link('order-detail', {
    orderId: order.id,
    sortItems: null // doesn't have to be here, just explicitly null-ing query params
  });

  metaManager.setLink('canonical', orderDetailLink);
}
```
