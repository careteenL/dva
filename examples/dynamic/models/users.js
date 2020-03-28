import { delay } from '../utils';
export default {
    namespace: 'users',
    state: {
        list: [
            { id: 1, name: "珠峰" },
            { id: 2, name: "架构" }
        ]
    },
    reducers: {
        add(state, action) {
            /*  return {
                 list: [
                     ...state.list,
                     { id: 3, name: action.payload }
                 ]
             } */
            state.list.push({ id: 3, name: action.payload });
        }
    },
    effects: {
        *asyncAdd(action, { put, call }) {
            yield call(delay, 1000);
            yield put({ type: 'add', payload: '学院' });
        }
    },
    subscriptions: {
        something() {
            console.log('我是users something');
        }
    }
}