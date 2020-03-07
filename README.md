# reduxbag

[Callbag](https://github.com/callbag/callbag)-based middleware for [Redux](https://github.com/reactjs/redux).

- Tiny (<350b)
- Zero dependencies
- Similar API to redux-observable
- “Unlimited” operators ([callbag ecosystem](https://github.com/callbag/callbag/wiki))

## Install

```sh
yarn add reduxbag
# -- or --
npm install --save reduxbag
```

## Usage

```js
import map from 'callbag-map';
import pipe from 'callbag-pipe';
import mapPromise from 'callbag-map-promise';
import { createStore, applyMiddleware } from 'redux';
import createReduxbagMiddleware, { ofType } from 'reduxbag';

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat(action.text);
    default:
      return state;
  }
}

const ajaxEpic = (action$, store) => pipe(
  action$,
  ofType('FETCH_TODO'),
  mapPromise(action =>
    fetch(`//jsonplaceholder.typicode.com/posts/${(1+Math.random()*50)>>0}`)
    .then(res => res.json())
  ),
  map(data => ({
    type: 'ADD_TODO',
    text: data.title,
  })),
);

const store = createStore(
  todos,
  applyMiddleware(createReduxbagMiddleware(ajaxEpic)),
);

const logState = () => console.log(store.getState());
store.subscribe(logState);
logState();

store.dispatch({ type: 'ADD_TODO', text: 'Try out callbags' });
store.dispatch({ type: 'FETCH_TODO' });
```
