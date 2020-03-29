import { delay } from '../utils';
export default {
  namespace: 'users',
  state: {
    list: [
      { id: 1, name: "Careteen" },
      { id: 2, name: "Lan" }
    ]
  },
  reducers: {
    add(state, action) {
      state.list.push({ id: 3, name: action.payload });
    }
  },
  effects: {
    *asyncAdd(action, { put, call }) {
      yield call(delay, 1000);
      yield put({ type: 'add', payload: '💗' });
    }
  },
  subscriptions: {
    something() {
      console.log('我是users something');
    }
  }
}