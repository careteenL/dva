import { compose } from "redux";
//extraEnhancers
//import { createStore } from 'redux';

function enhancers1(createStore) {
  return (reducer) => {
    console.log('enhancers1');
    let store = createStore(reducer);
    store.enhancers1 = 'enhancers1'
    return store;
  }
}
function enhancers2(createStore) {
  return (reducer) => {
    console.log('enhancers2');
    let store = createStore(reducer);
    store.enhancers2 = 'enhancers2'
    return store;
  }
}
function createStore(reducer) {
  return { getState: {}, reducer };
}
let fn = compose(enhancers1, enhancers2);
// fn createStore => createStore;
let newCreateStore = enhancers2(enhancers1(createStore));
let store = newCreateStore('reducer');
console.log(store);

