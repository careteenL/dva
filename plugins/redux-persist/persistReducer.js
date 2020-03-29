import { PERSIST_INIT } from './constants';
// PERSIST_INIT就是把存储引擎里的数据取出来还原到仓库中去
export default function (persistConfig, reducer) {
  let initialized = false;//是否已经初始化
  let persistKey = `persist:${persistConfig.key}`;
  return function (state, action) {
    switch (action.type) {
      case PERSIST_INIT:
        initialized = true;
        let value = persistConfig.storage.getItem(persistKey);
        state = value ? JSON.parse(value) : undefined;
        return reducer(state, action);
      default:
        if (initialized) {
          state = reducer(state, action);
          persistConfig.storage.setItem(persistKey, JSON.stringify(state));
          return state;
        }
        return reducer(state, action);
    }
  }
}
