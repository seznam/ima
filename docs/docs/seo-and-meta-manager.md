---
layout: "docs"
---

If you've read the [Controller lifecycle](Controller-lifecycle) page you've 
probably come along the [`setMetaParams`](/docs/controller-lifecycle.html#setmetaparams-serverclient)
method. This method is dedicated to set meta information for a specific
page and you are provided with everything you need *(current state, MetaManager, 
router, dictionary and settings)*.

**MetaManager** is then used in [DocumentView](Rendering-process#documentview) to
set `<title/>`, `<meta/>` and `<link/>` tags.

## Setting and obtaining information from the MetaManager

Meta manager offers many methods to work with document meta data, we're going to describe each one in
few following sections.

### Managing document title - `setTitle()`, `getTitle()`

Sets the page title...

```javascript
// app/page/order/OrderController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { order } = loadedResources;
  const title = `Order #${order.id} - ${settings.general.appTitle}`
  metaManager.setTitle(title);
}
```

...and displays it.

```jsx
// app/component/document/DocumentView.jsx

render() {
  return (
    <html>
      <head>
        <title>{this.props.metaManager.getTitle()}</title>
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  );
}
```

### Configuring meta tags - `setMetaName()`, `getMetaName()`, `getMetaNames()`

Sets the information to be used in `<meta name="..." content="..."/>`.

```javascript
// app/page/BaseController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  metaManager.setMetaName(
    'description', 
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  );
}
```

```jsx
// app/component/document/DocumentView.jsx

<meta name="description" content={this.props.metaManager.getMetaName('description')} />
```

The `name` attribute of the `<meta/>` tag should match the 1st 
argument of the `setMetaName()` method otherwise the contents won't be updated.

### Configuring meta properties - `setMetaProperty()`, `getMetaProperty()`, `setMetaProperties()`

These methods are similar to the two above except that these are used for 
`<meta property="..." content="..."/>`.

```javascript
// app/page/ArticleController.js

setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
  const { article } = loadedResources;
  metaManager.setMetaProperty('og:image', article.thumbnailUrl);
}
```

```jsx
// app/component/document/DocumentView.jsx

<meta property="og:image" content={this.props.metaManager.getMetaProperty('og:image')} />
```

Again, the `property` attribute of the `<meta>` tag should match the 1st 
argument of the `setMetaProperty()` method otherwise the contents won't be updated.

### Configuring links - `setLink()`, `getLink()`, `getLinks()`

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

```jsx
// app/component/document/DocumentView.jsx

<link rel="canonical" href={this.props.metaManager.getLink('canonical')} />
```

## Automatically displaying all information

If you don't want to bother with displaying each `<meta/>` or `<link/>` tag 
separately use the `getMetaNames()`, `getMetaProperties()` and `getLinks()` 
methods.

```jsx
// app/component/document/DocumentView.jsx`

// in the beginning of render() method
const { metaManager } = this.props;

// ...
<head>
  {metaManager.getMetaNames().map(name => (
    <meta key={name} name={name} content={metaManager.getMetaName(name)} />
  ))}
  {metaManager.getMetaProperties().map(property => (
    <meta key={property} property={property} content={metaManager.getMetaProperty(property)} />
  ))}
  {metaManager.getLinks().map(relation => (
    <link key={relation} rel={relation} href={metaManager.getLink(relation)} />
  ))}
</head>
```
