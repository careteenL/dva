let plugin = {
  extractReducers: [
    {
      key1: (state, action) => state
    },
    {
      key2: (state, action) => state
    }
  ]
}
let reducers = Object.assign({}, plugin.extractReducers[0], plugin.extractReducers[1]);
console.log(reducers);

let rootReducer = combineReducers({ ...reducers });

function combineReducers(reducers) {

  return function (state, action) {
    let newState = {};
    newState['key1'] = { number: 1 };
    newState['key2'] = { number: 1 };
    return newState;
  }
}
