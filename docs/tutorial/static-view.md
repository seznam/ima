---
layout: "tutorial"
---
# 2. Static view

---

## Static view

Open up the `app/page/home/HomeView.jsx` file in your code editor. You will see a
single ES2015 class named `HomeView`, extending the `AbstractComponent` class
(which in turn extends the
[`React.Component`](https://facebook.github.io/react/docs/component-api.html)
class).

Now let's replace the contents of the file with a blank ES2015-only view:

```javascript
import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

export default class HomeView extends AbstractComponent {
	render() {
		return (
			null
		);
	}
}

```

The `HomeView` class defines the `render()` method. Notice that our current
`HomeView` class does not have the `constructor()` method, as the default
one provided by the `AbstractComponent` class will do in this case.

The `constructor()` is the class constructor (an object initializer, if you
will) that sets the component's initial properties (`props`) and context. The
`props` object represents the properties set on our view component by the
code using it (the properties are set using the element attributes in JSX,
you can find our more about this
[here](http://facebook.github.io/react/docs/getting-started.html)). The
context is an object representing the "globals" for the React components in
the application. IMA.js uses the context to pass view utils to components,
you can find out more about it
[here](https://facebook.github.io/react/docs/context.html).

The `render()` method creates and returns a React element that represents the
view in the UI. Our `render()` method returns `null` because our component does
not have a UI yet.

Now that we know our way around our component, let's replace the contents of
the `render()` method with the following code:

```javascript
return (
  <div className='l-home container'>
    Hello {'World'}!
  </div>
);
```

The "HTML" code you see is actually an XML markup with JavaScript expressions
embedded within curly braces. This markup is processed automatically by Babel's
JSX transformer into ordinary JavaScript expressions creating React elements
(React's virtual DOM allowing rendering at both the client and the server side).
This combination of JavaScript and XML is commonly referred to as JSX and you
can find out more about it
[here](http://facebook.github.io/react/docs/jsx-in-depth.html).

The `render()` method must always return a React element (or a similar plain
object, or `null`), so it can be properly rendered at both the client and
server. Never attempt to create an actual DOM element in your view - your
application will most likely break! This is because your code is run at the
server at first, where no DOM is available, and polyfilling it, while possible,
would introduce a large overhead. Additionally, since the UI is rendered using
React which modifies the DOM at the client side, any changes to the DOM you would
manage to make would likely be lost with the next update of the page's UI.

Let's replace the inside of the `<div className='l-home container'>` element
with the following code:

```xml
<h1>Guestbook</h1>

<div className='posting-form well'>
  <form action='' method='post'>
    <fieldset>
      <legend>Add a post</legend>

      <div className='form-group'>
        <label htmlFor='postForm-name'>
          Name:
        </label>
        <input
            id='postForm-name'
            className='form-control'
            type='text'
            name='name'
            placeholder='Your name'/>
      </div>
      <div className='form-group'>
        <label htmlFor='postForm-content'>
          Post:
        </label>
        <textarea
            id='postForm-content'
            className='form-control'
            name='post'
            placeholder='What would you like to tell us?'/>
      </div>

      <button type='submit' className='btn btn-primary'>
        Submit
        <div className='ripple-wrapper'></div>
      </button>
    </fieldset>
  </form>
</div>

<div className='posts'>
  <h2>Posts</h2>

  <div className='post panel panel-default'>
    <div className='panel-body'>
      I'm lovin' this IMA.js thing!
    </div>
    <div className='post-author panel-footer'>
      John Doe
  </div>
  </div>
  <div className='post panel panel-default'>
    <div className='panel-body'>
      JavaScript everywhere! It's just JavaScript!
    </div>
    <div className='post-author panel-footer'>Jan Nowak</div>
  </div>
  <div className='post panel panel-default'>
    <div className='panel-body'>
      Developing applications is fun again! Thanks, IMA.js!
    </div>
    <div className='post-author panel-footer'>
      Peter Q.
    </div>
  </div>
  <div className='post panel panel-default'>
    <div className='panel-body'>
      How about a coffee?
    </div>
    <div className='post-author panel-footer'>
      Daryll J.
    </div>
  </div>
</div>
```

Whoa, that's a lot of code! But don't worry, it's just a form we'll use to
write new posts and some example posts. Notice the CSS class we put on the root
element though (`l-home`). It is considered a good practice to add such a CSS
class on the root element of every React component and/or controller view. The
CSS class name should be the slugified version of the React component's /
controller's name, for example `MyAwesomeComponent` would become
`my-awesome-component`. Additionally, it is recommended to prefix the
controller's name with `l-` (think "layout"), leading to `l-home` for our
`Home` controller's view.

The main point of this practice is that it enables easy scoping of CSS rules
that should affect only the contents of the component and not the rest of the
page, thus reducing the amount of possible conflicts in CSS declarations.

The `l-` prefix used in the case of controller views is added to prevent
possible collisions with components that might share the same name, and to
allow easy inclusion of single page-specific overrides for the UI of your
components that will not affect the rest of the pages in your application.

In general, it is recommended to organize your CSS code according to the
[SMACSS](https://smacss.com/) recomendation (Scalable and Modular Architecture
for CSS). Feel free to read through the page if you are not familiar with
SMACSS yet, it won't take you long.

So let's make our guestbook look a little better. We start by installing
the Bootstrap CSS library and the Material theme by first creating the
`.bowerrc` file with the following content in the `IMA.js-skeleton`
directory:

```
{
	"directory": "app/assets/static/bower/"
}
```

With bower configured, run the following commands:

```
npm install bower
./node_modules/bower/bin/bower install bootstrap bootstrap-material-design
```

Next we need to include a few files in our page. Open the document component
`app/component/document/DocumentView.jsx` - this is the UI component that renders the
basic structure of the HTML document. You'll find more details about it in the
[Rendering the whole document](#rendering-the-whole-document) section of this chapter.

Insert the following code before the
`<link rel="stylesheet" ...` line to include
the Bootstrap CSS library and the Material design theme:

```xml
<link rel='stylesheet' href='/static/bower/bootstrap/dist/css/bootstrap.min.css'/>
<link rel='stylesheet' href='/static/bower/bootstrap-material-design/dist/css/ripples.min.css'/>
<link rel='stylesheet' href='/static/bower/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'/>
<script src='/static/bower/jquery/dist/jquery.min.js'></script>
<script src='/static/bower/bootstrap/dist/js/bootstrap.min.js'></script>
<script src='/static/bower/bootstrap-material-design/dist/js/material.min.js'></script>
<script src='/static/bower/bootstrap-material-design/dist/js/ripples.min.js'></script>
```

That's a lot of stuff, but it will save us a lot of effort with styling our UI.

So let's write some CSS to make our guestbook look event better. Open the
`app/assets/less/settings.less` file and add the following code to set up our
layout configuration:

```less
@post-author-alignment: right;
@background-image: 'http://i.imgur.com/vzMkcoz.png';

```

The credit for the image we'll use as our page background goes to
[Midhun Harikumar](https://plus.google.com/photos/+MidhunHarikumar/albums/6121148941176472961),
the image is provided under the
[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

Next open the `app/assets/less/base.less` file and add the following code:

```less
body {
  background-image: url(@background-image);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
}

```

Now let's open the the `app/page/home/homeView.less` file and replace the
contents with the following code:

```less
.l-home {
  .post-author {
    text-align: @post-author-alignment;
    font-style: italic;
    font-size: 85%;
  }
}

```

Go ahead and check the result in the browser. It sure does look a little
better (you may have to reload the page, or event restart the dev server
by hitting Ctrl+C and then re-running the `npm run dev` command if your
browser cannot access the newly installed bower resources).

### Rendering the whole document

As you may have noticed, we didn't specify any `<html>` or `<body>` element in
our controller view, and yet the page rendered in the browser has them. So how
did this little piece of magic happen?

As you may recall from the beginning of this tutorial, the `app/component`
directory contains components that are used in the application UI. There is one
special component - the document component
(`app/component/document/DocumentView.jsx`). The document component handles
rendering the basic structure of the HTML document like the `<html>` and
`<body>` elements.

Finally, the document component must render three `<div>` elements, `#page`,
`#revivalSettings` and `#scripts`. The first one will contain the current view.
The second one will contain scripts used to initialize the environment for your
application at the client side, while the third one will contain the JavaScript
logic of your application. The order is important as this will allow your users
to see the whole of the page content before the application is fully loaded in
the browser (remember, the content is first rendered at the server side).

The one thing the document component does not render and is handled by IMA.js
itself is the `<!doctype html>` doctype at the beginning of the rendered page -
this is due to the limitations of the React library, but you don't need to
concern yourself with this very much.

Note that the document component is only used at the server-side, as the
application only updates the contents of the `#page` element at the
client-side (and the page title and meta tags through the meta-manager, which
will not be covered by this tutorial, but you can learn more about it in its
interface `node_modules/ima/meta/MetaManager.js`).

### Notes on ES2015 modules and IMA.js namespaces

Starting with version 15 of IMA.js namespaces were deprecated in favor of ES2015
modules. Mainly because ES modules are now more widespread and have better support
in many IDEs thus don't pose such problem when it comes to refactoring.

Previously almost all of the JavaScript files in your IMA.js application included
a snippet of code like this one near the beginning:

```javascript
import ns from 'ima/namespace';

ns.namespace('app.foo.bar');
```

and ended with a line of code like this one:

```javascript
ns.app.foo.bar.Baz = Baz;
```

The first snippet imports the object that represents the root namespace for the
classes, constants and values in the application, and then ensures that the
namespace to which the class / constant / value will be bound exists by calling
`ns.namespace('namespace name goes here')`. The second snippet binds the class,
constant or value created in the file to the namespace.

If you're using version 15 and above you can safely remove deprecated namespaces
and replace them with ES2015 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

Anyway, that's it for this part of the tutorial, so head over to the
[part 3](Tutorial,-part-3) to learn about application state.
