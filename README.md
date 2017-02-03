### Introduction

So as you remember, mapStateToProps gives us a degree of separation of concerns by allowing us to not reference our store in our component when retrieving the state.  So it moved us towards having our state management in one part of our code, and our display of our state management in a different part.  In other words, it started the process of removing knowledge of redux inside our components.  

What prevented us from fully removing a reference to redux inside our components was that we did not know how to dispatch actions without calling store.dispatch() from our component.  Well, in this lesson we'll learn how to do just that.  We'll remove knowledge of the store from our components by using a method similar to mapStateToProps, which is called mapDispatchToProps.

## Identifying the Problem

So we're back to using the same codebase as we used in our mapStateToProps readme.  Essentially, inside the `src/App.js` file, you can see that clicking on a button dispatches an action to the store.  In the mapStateToProps readme, we changed our code such that we no longer reference the store to get an updated state of the items, but we still do reference the store to dispatch the action.  If you look at the line inside the handleOnClick function, you'll see the culprit:

```javascript
  handleOnClick(){
    this.props.store.dispatch(getCountOfItems())
  }
```

Ok, so this may seem small, but it introduces our old problem.  Our component is no longer indifferent about its state management system.  Instead, this line of code makes the component reliant on redux.  

Well we can fix this problem with our connect function.  Just like we can write code like `connect(mapStateToProps)(App)` to add new props to our App component, we can pass connect a second argument, and add our action creator as props.  Then we can reference this action creator as a prop to call it from our component.  We'll spend the rest of this lesson unpacking the previous sentence.  Ok, let's see how this works.

### Using mapDispatchToProps

We use mapDispatchToProps by passing our connect function a second argument that adds new props to the function, that point to action creators.  So updating our `src/App.js` file, it looks like the following:

``` javascript
  import React, { Component } from 'react';
  import './App.css';
  import { connect } from 'react-redux';
  import { addItem } from  './actions/items'

  class App extends Component {
    handleOnClick(){
      this.props.store.dispatch(addItem())
    }
    render() {
      return (
        <div className="App">
            <button onClick={this.handleOnClick.bind(this)}>Click</button>
            <p> {this.props.items.length}</p>
        </div>
      );
    }
  }
                                                      // add function as second argument
  const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App)

  function mapStateToProps(state){
    return {items: state.items}
  }

  // added mapDispatchToProps function
  function mapDispatchToProps(){
    return {addItem: addItem}
  }

  export default connectedComponent;
```
Ok, so let's see what adding our mapDispatchToProps function, and passing it through as a second argument accomplished.  We'll place in another debugger in our component, right below the word render.  Now, boot up the app, open up your console and when you hit the debugger statement, type in `this.props.addItem`.  You'll see that it returns the action creator addItem.  So just like with mapDispatchToProps we added a prop that pointed to a value, here we add a prop addItem that points to the value, which in this case is our action creator.  So now we can change our code such that when the handleOnClick function gets called, we execute our action creator by referencing it as a prop.  Here's the code:

```javascript
  ...
  handleOnClick(){
    this.props.addItem()
  }
  render() {
    return (
      <div className="App">
          <button onClick={this.handleOnClick.bind(this)}>Click</button>
          <p> {this.props.items.length}</p>
      </div>
    );
  }
  ...
```

So this code calls the handleOnClick method after the button is clicked.  The handleOnClick references and then executes the addItem function by calling this.props.addItem().  This code does call our action creator, but it's not good enough.  Remember that action creator is just a simple javascript function and all it returns is return a plain old javascript object.  So right now each time we click a button, we call our action creator.  What we really want to do is call our action creator, and then dispatch the returned action to the store.  Well by changing our mapDispatchToProps method a little we can do just that.  

### BindActionCreators

So we know that it's not good enough to pass through a prop that we can use to execute an action creator.  What we need is the ability to execute the store's dispatch method and pass the dispatch method the return value of the action creator.  By accessing a method from the redux library called bindActionCreators we can do just that.  

```javascript
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'

  connect(mapStateToProps, mapDispatchToProps)(App)

  function mapStateToProps(state){
    return {items: state.items}
  }

  function mapDispatchToProps(dispatch){
    return bindActionCreators({addItem: addItem}, dispatch)
  }
```

The first change we made was to add an argument to our mapDispatchToProps method called dispatch.  So just as the mapStateToProps function receives the state from the store as its argument, the mapDispatchToProps receives the dispatch method from the store.  Now that we have this dispatch method, we have to say what we would like to eventually dispatch.  We do this by using our method from the redux, bindActionCreators, and passing to it, our new props, as well as the store's dispatch method.  

Now let's place back in our debugger inside the App's render function.  If you refresh the page, and now type in this.props.addItem, you will seeing the following returned:

```javascript
  function () {
      return dispatch(actionCreator.apply(undefined, arguments));
    }
```

So you can see that our addItem prop no longer directly points to the action creator, but instead points to the dispatch method, and passes through the return value of the action creator as its argument.  It's ok if you don't totally understand the code above, just know that this is what it's doing.  Well see it for yourself, remove the debugger, and click the button.  You will see that now our view is changing as our action to 'GET_COUNT_OF_ITEMS' is being dispatched.  And if you look at the redux devtools, you can see the action dispatched along with the corresponding state change.

## Summary

In this lesson we saw that we can remove all reference to our store from our component via the mapDispatchToProps method.  We saw that mapDispatchToProps allows us to pass through our action creator as a prop, and that by using redux's bindActionCreators method, we can wrap the action creator in our store's dispatch method, so that the action is properly dispatched to the store.
