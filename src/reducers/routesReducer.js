const initialState = {
  routes: {},
};

// eslint-disable-next-line require-jsdoc
function routeReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA':
      return Object.assign({}, state, {
        routes: action.payload,
      });
    default:
      return state;
  }
}

export default routeReducer;
