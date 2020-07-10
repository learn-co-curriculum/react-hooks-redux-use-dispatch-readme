# Mapping Dispatch to Props

## Objectives

- Write functions that connect Redux actions to component events

### Introduction

In the last lessons, we learned that `mapStateToProps()` separates
concerns. We no longer have to reference the store inside our component when
retrieving the state. We are moving towards having state management in one
part of our code, and display logic in a different part.

In other words, we're moving knowledge of _Redux_ outside our components.

What prevented us from fully removing a reference to __Redux__ inside our
components was that we did not know how to dispatch actions without calling
`store.dispatch()` from our component.  Well, in this lesson we'll learn how
to do just that. We'll remove knowledge of the store from our components by
using a function similar to `mapStateToProps()`, which is called
`mapDispatchToProps()`.

## Identifying the Problem

To begin, take a look at the starting code provided in `src/App.js`:

```js
// ./src/App.js
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { addItem } from  './actions/items';

class App extends Component {

  handleOnClick() {
    this.props.store.dispatch(addItem());
  }

  render() {
    return (
      <div className="App">
        <button onClick={(event) => this.handleOnClick(event)}>
          Click
          </button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    items: state.items
  };
};

export default connect(mapStateToProps)(App);
```

We can see that `mapStateToProps()` is already implemented and is
making `state.items` available to `App` as `this.props.items`. We
also see that the button in `render()` calls `handleOnClick()` when
clicked. The `handleOnClick()` does one thing - it dispatches an action 
to the _store_.

In the earlier `mapStateToProps()` Readme, we changed our code such that we no
longer reference the store to get an updated state of the items, but here we
still reference the store in `handleOnClick()` to dispatch an action:

```javascript
// ./src/app.js
...

handleOnClick(){
  this.props.store.dispatch(addItem())
}

...
```

Okay, so this may seem small, but it introduces our old problem. Our component is
no longer indifferent about its state management system. Instead, this line of
code makes the component reliant on __Redux__.  

Well we can fix this problem with our `connect()` function. Just like we can
write code like `connect(mapStateToProps)(App)` to add new props to our __App__
component, we can pass `connect()` a second argument, and add our _action
creator_ as props. Then we can reference this action creator as a prop to call
it from our component. We'll spend the rest of this lesson unpacking the
previous sentence. Okay, let's see how this works.

#### Using `mapDispatchToProps`

To quickly review: The first argument passed into `connect()` is a function.
That function is written to accept the Redux store's state as an argument and
returns an object created using all or some of that state. Key/value pairs in
this returned object will become values we can access in the component we've
wrapped with `connect()`. The below example, for instance, would make the entire
state available as a prop:

```js
const mapStateToProps = state => {
  return state
}
```

We call this function `mapStateToProps` because that is what it does. This
function is passed in as the _first_ argument to `connect()`. When `connect()` executes, it calls the function passed in as its first argument, passing in the current state to the function.

Just like the first argument, `connect()` accepts a **function** for the
_second_ argument. This time, again, when `connect()` executes, it calls the
second function passed in. However, instead of passing _state_ in, it passes in
the _dispatch_ function. This means we can write a function assuming we have
access to `dispatch()`. We call it `mapDispatchToProps` because that is
what it does. Updating our `./src/App.js` file, it looks like the following:

``` javascript
// src/App.js

import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { addItem } from  './actions/items';

class App extends Component {

  handleOnClick = event => {
    this.props.addItem() // Code change: this.props.store.dispatch is no longer being called
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleOnClick}>
          Click
          </button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    items: state.items
  };
};

// Code change: this new function takes in dispatch as an argument
// It then returns an object that contains a function as a value!
// Notice above in handleOnClick() that this function, addItem(),
// is what is called, NOT the addItem action creator itself.
const mapDispatchToProps = dispatch => {
  return {
    addItem: () => {
      dispatch(addItem())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Okay, so let's see what adding our `mapDispatchToProps()` function, and passing it
through as a second argument accomplished. We'll place in another debugger in
our component, right at the beginning of `render()`, just before the return
statement. 

```js
// src/App.js
...
render() {
    debugger
    return (
      <div className="App">
        <button onClick={this.handleOnClick}>
          Click
          </button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
...
```

Now, boot up the app, open up your console and when you hit the debugger
statement, type in `this.props.addItem`. You'll see that it returns a function
with dispatch inside. So, just like with `mapStateToProps()`, we added a prop
that pointed to a value, here we add a prop `addItem` that points to the value,
a function. The `dispatch` function is available as an argument to
`mapDispatchToProps`. By defining the function `addItem` inside
`mapDispatchToProps`, we're able to include `dispatch` in the definition; we've
bundled everything we need into a single prop value.

With `dispatch` integrated into `this.props.addItem`, we can change our code such that when the `handleOnClick()` function
gets called, we execute our action creator by referencing it as a prop:

```javascript
// ./src/App.js

...

handleOnClick = event => {
  this.props.addItem()
}

...
```

This code calls the `handleOnClick()` function after the button is clicked.
The `handleOnClick()` references and then executes the `addItem()` function
by calling `this.props.addItem()`.  

## Alternative Method

There is an even simpler way to approach bundling our actions and `dispatch`
into props. The second argument of `connect` will accept a function (as we've seen)
_or_ an object. If we pass in a function, `mapDispatchToProps()`, we must
incorporate `dispatch` as with the previous example. If we pass in an object, `connect` handles this step for us! The object just needs to
contain key/value pairs for each action creator we want to become props.
In our example, we've using the `addItem` action creator, so the object
would look like this:

```js
{
  addItem: addItem
}
```

As of JavaScript ES6, when we have an object with a key and value with
the same name, we can use the shorthand syntax and write:

```js
{
  addItem
}
```

This is all we need to pass in as a second argument for `connect()`.

`App` then changes to look like the following:

```js
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { addItem } from  './actions/items';

class App extends Component {

  handleOnClick = event => {
    this.props.addItem()
  }

  render() {
    debugger
    return (
      <div className="App">
        <button onClick={this.handleOnClick}>
          Click
          </button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    items: state.items
  };
};

export default connect(mapStateToProps, { addItem })(App); // Code change: no mapDispatchToProps function required!
```

> **Aside**: We _could_ go further and get rid of `mapStateToProps()` as well.
> We still need to pass in a function as the first argument, but it can be an
> anonymous arrow function that handles everything in one line:

```js
export default connect(state => ({ items: state.items }), { addItem })(App);
```

This is equivalent to writing:

```js
const mapStateToProps = state => {
  return {
    items: state.items
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addItem: () => { dispatch(addItem()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

## Default Dispatch Behavior

In addition to this, as per Dan Abramov, the creator of __Redux__:

> By default mapDispatchToProps is just dispatch => ({ dispatch }). So if you
don't specify the second argument to connect(), you'll get dispatch injected as
a prop in your component.

This means that if we were to simply write:

```js
export default connect(state => ({ items: state.items }))(App);
```

...we would _still_ have `this.props.dispatch()` available to us in App. If you
would rather write `this.props.dispatch({ type: 'INCREASE_COUNT' })` in App, or
pass `dispatch` down to children, you can!

## Resources

- [Dan Abramov Stack Overflow Response about mapDispatchToProps](https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux)

## Summary

In this lesson, we saw that we can remove all references to our store from our
component via the `mapDispatchToProps()` function. We saw that
`mapDispatchToProps()` allows us to bring in actions, combine them with
`dispatch` and connect events on our page to actions in our store.
