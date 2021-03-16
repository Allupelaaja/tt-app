const initialState = {
  routes: {},
  content: {},
  isOpen: false,
  address: '',
};

/**
 * @param {state} state
 * @param {action} action
 * @return {function}
*/
function routeReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA':
      return Object.assign({}, state, {
        routes: action.payload,
      });
    case 'SET_OPEN':
      return Object.assign({}, state, {
        content: action.payload,
      });
    case 'SET_BOOL':
      return Object.assign({}, state, {
        isOpen: action.payload,
      });
    case 'SET_ADDRESS':
      return Object.assign({}, state, {
        address: action.payload,
      });
    default:
      return state;
  }
}

export default routeReducer;
