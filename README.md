### Introduction

So as you remember, __mapStateToProps()__ gives us a degree of separation of concerns by allowing us to not reference our store in our component when retrieving the state. So it moved us towards having our state management in one part of our code, and our display of our state management in a different part. In other words, it started the process of removing knowledge of __Redux__ inside our components.  

What prevented us from fully removing a reference to __Redux__ inside our components was that we did not know how to dispatch actions without calling __store.dispatch()__ from our component.  Well, in this lesson we'll learn how to do just that. We'll remove knowledge of the store from our components by using a function similar to __mapStateToProps()__, which is called __mapDispatchToProps()__.

## Identifying the Problem

So we're back to using the same codebase as we used in our __mapStateToProps()__ readme.  Essentially, inside the `./src/App.js` file, you can see that clicking on a button dispatches an action to the store. In the __mapStateToProps()__ readme, we changed our code such that we no longer reference the store to get an updated state of the items, but we still do reference the store to dispatch the action.  If you look at the line inside the handleOnClick function, you'll see the culprit:

```javascript
// ./src/app.js 
...

handleOnClick(){
  this.props.store.dispatch(addItem())
}

...
```

Ok, so this may seem small, but it introduces our old problem. Our component is no longer indifferent about its state management system. Instead, this line of code makes the component reliant on __Redux__.  

Well we can fix this problem with our __connect()__ function. Just like we can write code like `connect(mapStateToProps)(App)` to add new props to our __App__ component, we can pass __connect()__ a second argument, and add our action creator as props. Then we can reference this action creator as a prop to call it from our component. We'll spend the rest of this lesson unpacking the previous sentence. Ok, let's see how this works.

### Using mapDispatchToProps

We use __mapDispatchToProps()__ by passing our __connect()__ function a second argument that adds new props to the function, that point to action creators. So updating our `./src/App.js` file, it looks like the following:

``` javascript
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

/* code change */
const mapDispatchToProps() {
  return {
    addItem: addItem
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Ok, so let's see what adding our __mapDispatchToProps()__ function, and passing it through as a second argument accomplished. We'll place in another debugger in our component, right below the word render. Now, boot up the app, open up your console and when you hit the debugger statement, type in `this.props.addItem`.  You'll see that it returns the action creator addItem. So just like with __mapStateToProps()__ we added a prop that pointed to a value, here we add a prop addItem that points to the value, which in this case is our action creator. So now we can change our code such that when the __handleOnClick()__ function gets called, we execute our action creator by referencing it as a prop. Here's the code:

```javascript
// ./src/App.js

...

handleOnClick() {
  this.props.addItem();
}

... 
```

So this code calls the __handleOnClick()__ function after the button is clicked. The __handleOnClick()__ references and then executes the __addItem()__ function by calling __this.props.addItem()__.  This code does call our action creator, but it's not good enough. Remember that action creator is just a simple JavaScript function and all it returns is return a plain old JavaScript object. So right now each time we click a button, we call our action creator. What we really want to do is call our action creator, and then dispatch the returned action to the store. Well by changing our __mapDispatchToProps()__ function a little so we can do just that.  

### BindActionCreators

So we know that it's not good enough to pass through a prop that we can use to execute an action creator. What we need is the ability to execute the store's dispatch function and pass the dispatch function the return value of the action creator. By accessing a function from the __Redux__ library called __bindActionCreators()__ we can do just that.  

```javascript
// ./src/App.js
import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux'; /* code change */
import { connect } from 'react-redux';

...

const mapStateToProps = (state) => {
  return {
    items: state.items
  };
};

const mapDispatchToProps(dispatch) {
  /* code change */
  return bindActionCreators({
    addItem: addItem
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

The first change we made was to add an argument to our __mapDispatchToProps()__ function called dispatch. So just as the __mapStateToProps()__ function receives the state from the store as its argument, the __mapDispatchToProps()__ receives the __dispatch__ function from the store. Now that we have this __dispatch__ function, we have to say what we would like to eventually dispatch. We do this by using our __bindActionCreators()__ function from __Redux__, and passing to it, our new props, as well as the store's dispatch function.  

Now let's place back in our debugger inside the __App__ component's render function. If you refresh the page, and now type in `this.props.addItem`, you will seeing the following returned:

```javascript
function () {
  return dispatch(actionCreator.apply(undefined, arguments));
}
```

So you can see that our __addItem()__ prop no longer directly points to the action creator, but instead points to the dispatch function, and passes through the return value of the action creator as its argument. It's ok if you don't totally understand the code above, just know that this is what it's doing. Well see it for yourself, remove the debugger, and click the button.  You will see that now our view is changing as our action to `'GET_COUNT_OF_ITEMS'` is being dispatched.  And if you look at the __Redux Devtools__, you can see the action dispatched along with the corresponding state change.

## Summary

In this lesson we saw that we can remove all reference to our store from our component via the __mapDispatchToProps()__ function. We saw that __mapDispatchToProps()__ allows us to pass through our action creator as a prop, and that by using __Redux's bindActionCreators()__ function, we can wrap the action creator in our store's dispatch function, so that the action is properly dispatched to the store.
