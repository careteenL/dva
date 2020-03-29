
let lastState;
function reducer(state = 0, action) {
  lastState = state;
}

reducer();
console.log(lastState);

