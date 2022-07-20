---
title: "Tutorial - 4. Fetching the data"
layout: "tutorial"
---

In [last part](/tutorial/adding-some-state) of this series we tidied up our HomeView component and split our render method
into much smaller and manageable components thanks to react. In this part we're going to 
mock the data fetching from server and learn more about IMA.js object container. 

## Mocking REST API

We won't go into building a REST API server with an actual database storing the
guestbook posts - that is beyond this tutorial and IMA.js. To give you the idea
of fetching data from the server, we'll create a simpler alternative.

We'll start by creating the `app/assets/static/api` directory and the
`app/assets/static/api/posts.json` file with the following content (**copied from
our home controller and modified**):

```json
[
  {
    "id": 4,
    "content": "Never mistake motion for action.",
    "author": "Ernest Hemingway"
  },
  {
    "id": 3,
    "content": "Quality means doing it right when no one is looking.",
    "author": "Henry Ford"
  },
  {
    "id": 2,
    "content": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "author": "Aristotle"
  },
  {
    "id": 1,
    "content": "Reality is merely an illusion, albeit a very persistent one.",
    "author": "Albert Einstein"
  }
]
```

Notice how we added the `id` field - as mentioned previously, in a real world
application, you should rely on the primary keys provided to you by your
backend instead of generating them yourself.

Now that we have our data ready, we just need some way to actually fetch it
from the server. To do that, we'll introduce 4 new classes into our project:
an **entity** class, a **factory** class, a **resource** class, and a **service** class.


### Entity Class

The **entity class** represents a typed data holder for our data (which is useful
for debugging) and allows us to add various computed properties without having
to modify our API backend.

Let's create the `app/model` and `app/model/post` directories and then a new
file `app/model/post/PostEntity.js` with the following content:

```javascript
export default class PostEntity {
  constructor(data) {
    this.id = data.id;
    
    this.content = data.content;

    this.author = data.author;
  }
}
```

We've just created a new class, exported it, and that's it, no more is currently
required. Our new entity class extracts the data obtained from a data object
(for example obtained from a deserialized JSON) and sets it to its fields.

### Factory Class

So, with our entity class ready, let's take a look at the **factory** class. **The
factory class will be used to create new entities from data objects and arrays
of data objects** - but in our case, the latter will suffice for now.

Create a new `app/model/post/PostFactory.js` file with the following content:

```javascript
import PostEntity from './PostEntity';

export default class PostFactory {
  static get $dependencies() {
    return [];
  }

  createList(entities) {
    return entities.map(entityData => new PostEntity(entityData));
  }
}
```

Our new factory class has just one method named `createList()`. The
method takes an array of data objects and returns an array of post entities.

### Resource Class

We have our entity and factory, now we need a resource class. **The resource
class represents our single point of access to a single REST API resource**
(or entity collection, if you will). The sole purpose of a resource class is to
provide a relatively low-level API for accessing the REST API resource. Create
a new `app/model/post/PostResource.js` file with the following contents:

```javascript
import PostFactory from './PostFactory';

export default class PostResource {
  static get $dependencies() {
    return ['$Http', PostFactory];
  }

  constructor(http, factory) {
    this._http = http;

    this._factory = factory;
  }

  getEntityList() {
    return this._http
      .get('http://localhost:3001/static/api/posts.json', {})
      .then(response => this._factory.createList(response.body));
  }
}
```

We defined the `getEntityList()` method in our resource class which we'll use
to fetch the posts from the server. In a real-world application we would use
configuration to set the URL to the resource instead of specifying it like
this, but that is beyond the scope of this tutorial.

The `_http.get()` method returns a new promise that resolves to the response
object of a GET HTTP request sent to the specified URL, with the provided query
parameters (the second parameter currently set to an empty object). The method
also automatically parses the JSON in our response body.

We then post-process the parsed response data using the Promise's `then`
callback which uses our factory to create an array of post entities.

You may have noticed that we have the `http` and `factory` parameters in our
constructor. This is how we provide the resource with the HTTP agent provided
by IMA.js, and our post entity factory. We'll take a look at how to do this
properly in a moment.

### Service class

You now may be wondering what is the point of the service class. 
It isn't that useful in our tutorial, but it would be essential in a bigger application.
The **resource should handle only sending requests and
processing responses** without any high-level operations. The **service class is
there to take care of the high-level stuff**. For example, should we have a REST
API that provides us with paged access to posts and we would want to fetch all
posts since a specific one, this would be handled by the service. The service
would fetch the necessary pages from the REST API, construct the result and
resolve to the constructed sequence of post entities.

In our case, however, the service will be very plain. Create a new
`app/model/post/PostService.js` file with the following content:

```javascript
import PostResource from './PostResource';

export default class PostService {
  static get $dependencies() {
    return [PostResource];
  }

  constructor(resource) {
    this._resource = resource;
  }

  getPosts() {
    return this._resource.getEntityList();
  }
}
```

Now that we have our entity, factory, resource and service, you may be thinking
that this is a little too much code for something so simple. Well, that depends
on many things. If you can expect mostly uniform data from your REST API with
little modifications required, you may want to use a reflection-powered
solution that requires you only to specify a single configuration item (API
root URL) and to create entity classes. The solution shown here is more robust
and flexible, allowing you to make slight adjustments to suit every resource
you are working with as required.

## Dependency injection

So how do we actually start using our post service? First we need to wire
everything up, well we actually already did that. You may have noticed that in most of the 
classes we used some weird static getter called `$dependencies`, that's how IMA.js built 
in dependency injection works.

IMA.js uses internally the Object Container class to handle all dependencies (you can
[read more about it in the documentation](/docs/object-container)), but the basic usage is fairly easy.
Every class that wants to use DI has to define static getter which returns an array of instances 
we want to inject to the constructor in the same order as defined in the array itself. Real
world example would then look something like this:


```javascript
import HttpClient from 'http';
import PostFactory from './PostFactory';

export default class PostResource {
  static get $dependencies() {
    return [HttpClient, PostFactory];
  }

  constructor(http, factory) {
    // http and factory contains instances of their respective classes
    this._http = http;
    this._factory = factory;
  }
}
```

The only condition to have DI working as expected is, that if you want to use any class as a dependency,
**it has to define static getter** `$dependencies`. Even if it does not have any dependencies and returns 
empty array. Otherwise OC will not recognize this as valid class to inject and it won't work.

### Object container & `bind.js`

Object container offers more functionality than just defining DI in the `$dependencies` method.
The `app/config/bind.js` offers full access to our Object container in the `init` method.
This allows you to do some pretty amazing stuff. You can create aliases for classes, constants,
inject dependencies and more. 

The object container serves mostly the following purposes - 
configuring class constructor dependencies, setting default implementing
classes of interfaces, creating aliases for classes, global registry of
values and an instance factory and registry.

Just like an ordinary **dependency injector**, the Object Container is used to
specify the dependencies of our classes, create and retrieve shared instances
and create new instances on demand.

The object container allows us to:

- **Specify the dependencies** of a class using the `inject()` method or by 
  overriding the `$dependencies()` static getter on the class itself (the
  dependencies will be passed in the constructor).
- **Create string aliases** for our classes using the `bind()` method (like the
  `$Http` alias we used to retrieve the HTTP agent provided by IMA.js).
- Create named **object container-global constants** using the `constant()` method.
- **Specify the default implementation** of an **interface** using the `provide()`
  method (this allows us to specify the interface as a dependency and switch
  the implementation everywhere in our application by changing a single
  configuration item).

**We can only access the object container in this configuration file**. After that
it works behind the scenes, providing dependencies and managing our shared
instances as needed. You can find out more about its [API](/api/general/object-container) by studying the
[documentation](/docs/object-container) or the [source code](https://github.com/seznam/ima/blob/master/packages/core/src/ObjectContainer.js).

### Using PostServices in HomeController

Let's take another look at the `$Http` alias among the dependencies of our post
resource - as already mentioned, this is an instance of the HTTP agent (client)
provided by the IMA.js. All utilities and services provided by IMA.js are bound
to the object container via aliases and have their aliases prefixed with `$` to
prevent accidental name collisions, but most can be used without having to use
aliases as dependency identifiers by specifying the classes and interfaces
themselves as dependencies.

Next we modify the dependencies of the `app/page/home/HomeController.js` by adding the
`PostService` dependency using the static getter syntax. The resulting code looks
as follows:

```javascript
import { AbstractController } from '@ima/core';
import PostService from 'app/model/post/PostService';

export default class HomeController extends AbstractController {
  static get $dependencies() {
    return [PostService];
  }

  constructor(postService) {
    super();

    this._postService = postService;
  }

  ...
}
```

This will push an instance of our post service as the first argument to the
constructor of our home page controller. With the post service safely in our 
`_postService` field, we can use it to fetch the posts from the server in our `load()` method:

```javascript
return {
  posts: this._postService.getPosts()
};
```

Finally, we can make use of our new post entities in the home controller's view
(`app/page/home/HomeView.jsx`). Let's modify the `_renderPosts()` method to look
like this:

```jsx
return this.props.posts.map(post => {
  return <Post key={post.id} content={post.content} author={post.author} />;
});
```

Notice how we use the `post.id` as the react element key here. Now go ahead, 
refresh the page and you'll see the posts still there, 
but this time fetched from the server! Or are they?

## Server-side rendering

If you open your browsers's developer tools, you may notice that the network log does
not show any request to `http://localhost:3001/static/api/posts.json`.

You may remember that IMA.js is an isomorphic JavaScript application stack.
This means that our application gets rendered at the server first, then it is
sent to the client with a serialized state information, and then the
application is "reanimated" at the client-side using the state information.

IMA.js caches the requests we make using the HTTP service at the server-side
and sends the serialized cache to the client. The cache is then deserialized at
the client-side, so the request to
`http://localhost:3001/static/api/posts.json` we do in our post resource will
be resolved from the cache, leading to no additional HTTP request being made.

<hr class="bottom-doc-separator">

Now that we are fetching posts from the server and fully understand how that
works, let's dive into writing new posts to our guestbook in the
[5th part of this tutorial](/tutorial/writing-posts).
