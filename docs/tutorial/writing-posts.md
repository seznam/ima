---
layout: "tutorial"
---
# 5. Writing posts

---

## Writing posts

To write new posts, we need to address several issues:

- notifying the controller that the user submitted the new post
- pretending to send the post to our server via HTTP (remember, we don't have
  an actual REST API backend)
- waiting for our post to be saved
- showing the updated list of posts

We want the controller to handle submitting posts to the guest book in our
application instead of the `postingForm` component to maintain a single
"source of truth" in our application. This should be the case for all
information that is related to the page as a whole. Local information (for
example starting music playback when the user clicks the play button of some
player component) may remain stored within the component itself, as it is not
necessarily important to the overall state of the page.

We'll use another IMA.js service to notify the controller that the user
submitted a new post - the event bus. In case you did not read the details
about communication between the controller and the view, the event bus is an
internal event system, built on top of DOM events, used for communication like
this.

First update the `<form ...` markup in the view of our `PostingForm` component
(`app/component/postingForm/PostingForm.jsx`) by adding an `onSubmit` event
listener:

```xml
<form action='' method='post' onSubmit={this._onSubmit.bind(this)}>
```

Next we need to add references to our form inputs:

```xml
<input
    id='postForm-name'
    className='form-control'
    type='text'
    name='name'
    ref={input => (this.authorInput = input)}
    placeholder='Your name'/>
...
<textarea
    id='postForm-content'
    className='form-control'
    name='post'
    ref={input => (this.contentInput = input}
    placeholder='What would you like to tell us?'/>
```

Now create the `_onSubmit()` method in the component:

```javascript
_onSubmit(event) {
  this.fire('postSubmitted', {
    author: this.authorInput.value,
    content: this.contentInput.value
  });

  this.authorInput.value = '';
  this.contentInput.value = '';

  event.preventDefault();
}
```

We fire the `postSubmitted` event using the event bus with the form data as
the event data, clear the form, and finally we prevent the browser from
submitting the form to the server.

The `ref` property on a native element accepts a callback that allows us to
assign DOM node reference to a variable or a class property. In this case
the native element is `<inupt>` and `<textarea>`. When the `ref` attribute
is applied on a non-native element (component) insted of DOM node reference
we get instance of the component.

The `fire()` method is a short-hand for `this.utils.$EventBus.fire(this, ...)`
call, which fires the custom DOM event using the event bus. The `this.utils`
property is set to the view utils - various objects, data and services that
are useful for rendering the UI - and is obtained from the React context.
The value returned by `this.utils` is configurable in the
`app/config/bind.js` configuration file and is represented by the constant
`$Utils`.

Now we need a way to capture the event in our home page controller, so open up
the home controller (the `app/page/home/HomeController.js` file) and add the
following method:

```javascript
onPostSubmitted(eventData) {
  // TODO
}
```

The IMA.js will automatically invoke this method when the `postSubmitted` event
bus event occurs. For details on how this mechanism works, please reffer to the
**Emiting events using the EventBus** section of the third chapter of this
tutorial.

Notice that our `onPostSubmitted()` event listener is a public method. This is
because it represents the (event) interface for the view components.

Before we will fill our `onPostSubmitted()` event listener with content however,
we need to update our post model classes first.

Open the post factory class (`app/model/post/PostFactory.js`) and add the
following method for creating a single post:

```javascript
createEntity(entityData) {
  return new PostEntity(entityData);
}
```

Since we don't like to repeat ourselves, update the `return` statement in the
`createList()` method as well:

```javascript
return entities.map(entityData => this.createEntity(entityData));
```

Now add the following method for creating new posts to the post resource
(`app/model/post/PostResource.js`):

```javascript
createPost(postData) {
  return this._http
    .post('http://localhost:3001/static/api/posts.json', postData)
    .then(response => this._factory.createEntity(response.body));
}
```

This method accepts a plain object containing the new post data and submits
them to the server using an HTTP POST request. The `_http.post()` method sends
the HTTP POST request and returns a promise that resolves to the server's
response with the response body parsed as JSON. We then use the server's
response to create a post entity representing the saved post.

Next we need to create a method for creating posts in our post service
(`app/model/post/PostService.js`):

```javascript
createPost(postData) {
  postData.id = null;
  return this._resource.createPost(postData);
}
```

This method sets the `id` field to `null` as it is expected for posts that were
not created yet (the post IDs should be generated by our backend) and uses the
post resource to create the post. The method returns a promise that resolves to
the post entity representing the created post.

With that in place, we can now fill in the contents of the `onPostSubmitted()`
event listener in the home page controller (`app/page/home/HomeController.js`):

```javascript
this._postService.createPost(eventData)
  .then(() => this._postService.getPosts())
  .then(posts => this.setState({ posts }));
```

This snippet calls the `createPost()` method with our event data, waits for the
post to be created, then requests the current list of posts from the post
service and updates the `posts` field in the view's state using the
`setState()` method. The `setState()` method updated only the fields of the
state that are present in the provided state object without modifying the rest,
and notifies the view about the new state so that the view is re-rendered.

Now that everything is wired up, we can start submitting new posts, right?
Well, not so fast. Remember, we do not have an actual REST API backend, so the
HTTP POST request will fail and no new post will be created.

Since we don't want to implement an actual backend, we will work around this
issue by implementing a [mock](http://en.wikipedia.org/wiki/Mock_object) HTTP
agent that fetches the posts from the server and then acts as if sending
subsequent requests to the server while managing our state (the created posts)
locally and creating responses on spot without any actual communication with
the server. This approach is useful for both tests and our simple tutorial.

To create our HTTP mock create the `app/mock` directory and the
`app/mock/MockHttpAgent.js` file with the following content:

```javascript
import HttpAgent from 'ima/http/HttpAgentImpl';

const GET_DELAY = 70; // milliseconds

const POST_DELAY = 90; // milliseconds

export default class MockHttpAgent extends HttpAgent {
  constructor(proxy, cache, cookie, config) {
    super(proxy, cache, cookie, config);

    this._posts = null;
  }

  get(url, data, options = {}) {
    if (!this._posts) {
      return super.get(url, data, options).then((response) => {
        this._posts = response.body;

        return {
          body: this._posts.map(post => Object.assign({}, post))
        };
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          body: this._posts.map(post => Object.assign({}, post))
        });
      }, GET_DELAY);
    });
  }

  post(url, data, options = {}) {
    if (!this._posts) {
      return this
        .get(url, {})
        .then(() => this.post(url, data));
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        let clone = Object.assign({}, data);

        clone.id = this._posts[0].id + 1;
        this._posts.unshift(clone);

        resolve({
          body: Object.assign({}, clone)
        });
      }, POST_DELAY);
    });
  }
}

```

Let's take this class apart and take a look at what it does. We extend the
`ima/http/HttpAgent` class which is the HTTP agent provided by IMA.js, so
we need to obtain its dependencies in our constructor
(`proxy, cache, cookie, config`) and pass them to the super-constructor.

Next we set up the `_posts` field that we'll use to keep track of all posts.

The `get()` method checks whether we already have the posts fetched from the
server, and, if we don't, it uses the super-implementation to fetch them and
store them in the `_posts` field. If the posts have already been fetched, the
method returns a promise that resolves to a clone of the posts after the
configured delay.

The `post()` method checks whether we already have the posts fetched from the
server, and, if we don't, it fetches them using the `get()` method and then
calls itself again. If we already have the posts fetched, the method clones the
data passed to it in parameters, generates an ID, stores the new record as the
first element of the `_posts` array while shifting the rest of the posts and
resolves the returned promise after the configured delay to the stored post.

We included the delays in our `get()` and `post()` methods to simulate the
latency imposed by a real networking. Also notice how we always clone the data
we receive before storing them internally and return only clones of the our
internal posts storage. This is to emulate the server behavior reliably, so
that new posts won't modify previously returned post arrays and later
modifications of data passed to or received from our mock server won't modify
the internal state or data returned by other calls to our methods.

To plug our HTTP mock into our application, we need to update the
`app/config/bind.js` a little more. First import the mock:

```javascript
import MockHttpAgent from 'app/mock/MockHttpAgent';
```

Next add the following line at the beginning of the exported `init` callback:

```javascript
oc.inject(MockHttpAgent, ['$HttpAgentProxy', '$Cache', '$CookieStorage', config.$Http]);
```

And update the dependencies of the `PostResource`:

```javascript
[MockHttpAgent, PostFactory]
```

Go ahead and check the result in the browser, you will now be able to write new
posts to our guestbook (which will disappear once you reload the page, since we
keep the posts only in our HTTP mock).

With our guestbook working, we can turn to adding some final polish to our
application in the [6th part of the tutorial](Tutorial,-part-6).
