### Introduction

So as you remember, `mapStateToProps()` gives us a degree of separation of
concerns by allowing us to not reference our store in our component when
retrieving the state. So it moved us towards having our state management in one
part of our code, and our display of our state management in a different part.
In other words, it started the process of removing knowledge of __Redux__ inside
our components.  

What prevented us from fully removing a reference to __Redux__ inside our
components was that we did not know how to dispatch actions without calling
`store.dispatch()` from our component.  Well, in this lesson we'll learn how
to do just that. We'll remove knowledge of the store from our components by
using a function similar to `mapStateToProps()`, which is called
`mapDispatchToProps()`.

## Identifying the Problem

So we're back to using the same codebase as we used in our `mapStateToProps()`
readme.  Essentially, inside the `./src/App.js` file, you can see that clicking
on a button dispatches an action to the store. In the `mapStateToProps()`
readme, we changed our code such that we no longer reference the store to get an
updated state of the items, but we still do reference the store to dispatch the
action.  If you look at the line inside the handleOnClick function, you'll see
the culprit:

```javascript
// ./src/app.js
...

handleOnClick(){
  this.props.store.dispatch(addItem())
}

...
```

Ok, so this may seem small, but it introduces our old problem. Our component is
no longer indifferent about its state management system. Instead, this line of
code makes the component reliant on __Redux__.  

Well we can fix this problem with our `connect()` function. Just like we can
write code like `connect(mapStateToProps)(App)` to add new props to our __App__
component, we can pass `connect()` a second argument, and add our action
creator as props. Then we can reference this action creator as a prop to call it
from our component. We'll spend the rest of this lesson unpacking the previous
sentence. Ok, let's see how this works.

#### Using mapDispatchToProps

We use `mapDispatchToProps()` by passing our `connect()` function a second
argument that adds new props to the function, that point to action creators. So
updating our `./src/App.js` file, it looks like the following:

``` javascript
// ./src/App.js

import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { addItem } from  './actions/items';

class App extends Component {

  handleOnClick = event => {
    this.props.addItem()
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

const mapDispatchToProps = dispatch => {
  return {
    addItem: () => {
      dispatch(addItem())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Ok, so let's see what adding our `mapDispatchToProps()` function, and passing it
through as a second argument accomplished. We'll place in another debugger in
our component, right below the word render. Now, boot up the app, open up your
console and when you hit the debugger statement, type in `this.props.addItem`.
You'll see that it returns a function with dispatch inside. So just like with
`mapStateToProps()` we added a prop that pointed to a value, here we add a prop
addItem that points to the value, a function. The `dispatch` function is
available as an argument to `mapDispatchToProps`. By including the `dispatch`,
we've bundled everything we need into a single prop value.

So now we can change our code such that when the `handleOnClick()` function
gets called, we execute our action creator by referencing it as a prop. Here's
the code:

```javascript
// ./src/App.js

...

handleOnClick = event => {
  this.props.addItem()
}

...
```

So this code calls the `handleOnClick()` function after the button is clicked.
The `handleOnClick()` references and then executes the `addItem()` function
by calling `this.props.addItem()`.  

There is an even simpler way to approach bundling our actions and `dispatch`
into props. The second argument of `connect` accepts a function, as we've see,
_or_ an object. If we pass in a function, `mapDispatchToProps()`, we must
incorporate `dispatch`. If we pass in an object, `connect` handles this for us!

App then changes to look like the following:

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

export default connect(mapStateToProps, { addItem })(App);
/* ES6 shorthand lets us pass in *one* value that will be read as the key and value */
```

We _could_ go further and get rid of `mapStateToProps()` as well, and handle it all in one line:

```js
export default connect(state => ({ items: state.items }), { addItem })(App);
```

## Summary

In this lesson we saw that we can remove all reference to our store from our
component via the `mapDispatchToProps()` function. We saw that
`mapDispatchToProps()` allows us to bring in actions, combine them with
`dispatch` and connect events on our page to actions in our store.
