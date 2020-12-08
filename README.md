# Using the useDispatch Hook Readme

## Objectives

- Write functions that connect Redux actions to component events

### Introduction

In the intro to this section, we saw how to use the `useDispatch` hook to access
the `dispatch` method from our Redux store inside our components. Here, we'll
explore `useDispatch` in more detail, and talk about ways of organizing our
Redux dispatching logic using action creators, like we saw in the previous
lesson.

## Identifying the Problem

To begin, take a look at the starting code provided in `src/features/counter/Counter.js`:

```js
// ./src/features/counter/Counter.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Counter() {
  // read from the Redux store
  const items = useSelector((state) => state.items);

  // gives us the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  function handleOnClick() {
    // dispatching an action on click
    dispatch({ type: "count/increment" });
  }

  return (
    <div>
      <button onClick={handleOnClick}>Click</button>
      <p>{items.length}</p>
    </div>
  );
}

export default Counter;
```

To recap what `useDispatch` is doing here: this code places a button on the page
with an `onClick` event listener pointed to `handleOnClick`. When
`handleOnClick` is invoked, it calls the `dispatch` function, provided by
`useDispatch`, to send an action to our Redux store.

Remember from our earlier lessons that our Redux `store` has a special
`dispatch` method that we must call any time we want to create a new state? The
[`useDispatch` hook][use-dispatch] gives us access to that `dispatch` method so
we can use it from any of our components!

## Using Action Creators

Right now, we're writing our action objects directly our component file:

```js
dispatch({ type: "count/increment" });
```

However, imagine our application grows and we want other components to be able
to dispatch this same action object. Re-writing these objects in every component
we need them is tedious and error prone. Remember, in the previous lesson on
action creators, we created a function that _returns_ an action object instead.
Let's try that out here as well:

```js
// ./src/features/counter/Counter.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function incrementCount() {
  return { type: "count/increment" };
}

function Counter() {
  const items = useSelector((state) => state.items);
  const dispatch = useDispatch();

  function handleOnClick() {
    dispatch(incrementCount());
  }

  return (
    <div>
      <button onClick={handleOnClick}>Click</button>
      <p>{items.length}</p>
    </div>
  );
}

export default Counter;
```

But what if another component needs to dispatch this function as well? Let's
just move it to our `counterSlice.js` file and export it from there, to organize
it alongside the rest of our Redux logic for this feature:

```js
// src/features/counter/counterSlice.js

// Action Creators
export function incrementCount() {
  return { type: "count/increment" };
}

// Reducer
```

Then, we can just import it in any components that need this action:

```js
// ./src/features/counter/Counter.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementCount } from "./counterSlice.js";
```

Now we have a good separation between our Redux-specific code and our React
components!

## Resources

- [Redux: Using Action Creators](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#using-action-creators)
