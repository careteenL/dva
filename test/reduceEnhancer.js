function getOnReducer(hook) {
  return function (reducer) {
    for (const reduceEnhancer of hook) {
      reducer = reduceEnhancer(reducer);
    }
    return reducer;
  }
}

let hook = [
  reducer => (state, action) => {
    console.log('reduceEnhancer1');
    return reducer(state, action);
  },
  reducer => (state, action) => {
    console.log('reduceEnhancer2');
    return reducer(state, action);
  },
  reducer => (state, action) => {
    console.log('reduceEnhancer3');
    return reducer(state, action);
  }
]
let reducer = (state, action) => {
  console.log('这是我包装前的reducer');
  return state;
}
for (const reduceEnhancer of hook) {
  reducer = reduceEnhancer(reducer);
}
reducer({ number: 0 }, {});
//reduceEnhancer3 reduceEnhancer2  reduceEnhancer1 这是我包装前的reducer