export default function shoppingListItemReducer(state = {
  items: []
}, action) {
  console.log(action)
  switch(action.type) {

    case 'INCREASE_COUNT':
      console.log(state.items.concat(state.items.length));
      return Object.assign({}, {
        items: state.items.concat(state.items.length)
      });

    default:
      console.log(state)
      return state;
  }
};
