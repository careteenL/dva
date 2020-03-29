let { produce } = require('immer');
let baseState = [
  { id: 1, name: 'careteen' },
  { id: 2, name: 'lan' }
]
let nextState = produce(baseState, draftState => {
  draftState[0].name = 'xiao7';
  draftState.push({ id: 3, name: '❤️' });
});
console.log(nextState);
