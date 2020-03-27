import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { createHashHistory } from 'history';
import { NAMESPACE_SEP } from './constant';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import { routerRedux } from './router';
import Plugin, { filterHooks } from './plugin';
export { connect }
let { routerMiddleware, connectRouter } = routerRedux;
let hashHistory = createHashHistory();
export default function (opts = {}) {
  let history = opts.history || hashHistory;
  let app = {
    _history: history,
    _models: [],
    model,
    _router: null,
    router,
    start
  }
  function model(m) {
    const prefixedModel = prefixNamespace(m);// 先添加命名空间的前缀
    app._models.push(prefixedModel);// 把model放在数组里去
    return prefixedModel;
  }
  function router(router) {
    app._router = router;// 定义路由
  }
  // 这个对象是要传给combineReducers的,是用来合并的,每个属性都是字符串，而且代表合并状态的一个分状态属性
  let initialReducers = {// 初始的reducer  connected-react-redux
    // 当页面路径发生改变时，会向仓库派发动作，仓库状态会发生改变 router:{location,action}
    router: connectRouter(app._history)
  };
  let plugin = new Plugin();
  plugin.use(filterHooks(opts));
  app.use = plugin.use.bind(plugin);
  function start(container) {
    for (const model of app._models) {
      // initialReducers={counter:(state,action)=>newState}
      initialReducers[model.namespace] = getReducer(model, plugin._handleActions);
    }

    let rootReducer = createReducer();// 返回一个根的reducer
    let sagas = getSagas(app);
    // app._store = createStore(reducers);
    let sagaMiddleware = createSagaMiddleware();
    const extraMiddlewares = plugin.get('onAction');
    const extraEnhancers = plugin.get('extraEnhancers');
    // applyMiddleware返回值是一个enhancer,增加createStore
    const enhancers = [...extraEnhancers, applyMiddleware(routerMiddleware(history),
      sagaMiddleware, ...extraMiddlewares)];
    // let store = applyMiddleware(routerMiddleware(history),sagaMiddleware, ...extraMiddlewares)(createStore)(rootReducer, opts.initialState);
    let store = createStore(rootReducer, opts.initialState, compose(...enhancers));
    app._store = store;
    let onStateChange = plugin.get('onStateChange');
    store.subscribe(() => {
      onStateChange.forEach(listener => listener(store.getState()))
    });
    // subscriptions
    for (const model of app._models) {
      runSubscription(model.subscriptions);
    }
    sagas.forEach(sagaMiddleware.run);// run就是启动saga执行
    ReactDOM.render(
      <Provider store={app._store}>
        {app._router({ app, history })}
      </Provider>
      , document.querySelector(container));
    // 向当前的应用插入一个模型  state reducers subscriptions effects  
    app.model = injectModel.bind(app);
    function injectModel(m) {
      m = model(m);// 给reducers effect名字添加命名空间前缀 添加app_models里去
      initialReducers[m.namespace] = getReducer(m, plugin._handleActions);
      store.replaceReducer(createReducer());// 用新的reducer替换掉老的reducer,派发默认动作，会让reducer执行，执行过完后会给 users赋上默认值
      if (m.effects) {
        sagaMiddleware.run(getSaga(m.effects, m));
      }
      if (m.subscriptions) {
        runSubscription(m.subscriptions);
      }
    }
    function runSubscription(subscriptions = {}) {
      for (let key in subscriptions) {
        let subscription = subscriptions[key];
        subscription({ history, dispatch: app._store.dispatch }, error => {
          let onError = plugin.get('onError');
          onError.forEach(fn => fn(error));
        });
      }
    }
    function createReducer() {
      const reducerEnhancer = plugin.get('onReducer');
      let extraReducers = plugin.get('extraReducers');
      return reducerEnhancer(combineReducers({
        ...initialReducers,
        ...extraReducers
      }));
    }
    function getSagas(app) {
      let sagas = [];
      for (const model of app._models) {
        // 把effects对象变成一个saga
        sagas.push(getSaga(model.effects, model, plugin.get('onEffect')));
      }
      return sagas;
    }
    function getSaga(effects, model) {
      return function* () {
        // key=asyncAdd key=asyncMinus 
        for (const key in effects) {
          const watcher = getWatcher(key, effects[key], model, plugin.get('onEffect'), plugin.get('onError'));
          // 为什么要调用fork 是因为fork不可单独开一个进程去执行，而不是阻塞当前saga的执行
          const task = yield sagaEffects.fork(watcher);
          yield sagaEffects.fork(function* () {
            yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
            yield sagaEffects.cancel(task);
          });
        }
      }
    }
  }
  return app;
}
function getReducer(model, handleActions) {
  let { reducers = {}, state: defaultState } = model;
  let reducer = function (state = defaultState, action) {
    let reducer = reducers[action.type];// action.type= "counter/add"
    if (reducer) {
      return reducer(state, action);
    }
    return state;
  }
  if (handleActions) {
    return handleActions(reducers, defaultState);
  }
  return reducer;
}


function prefixType(type, model) {
  if (type.indexOf('/') === -1) {
    return `${model.namespace}${NAMESPACE_SEP}${type}`;
  } else {
    if (type.startsWith(model.namespace)) {
      console.error(`Warning: [sagaEffects.put] ${type} should not be prefixed with namespace ${model.namespace}`);
    }
  }
  return type;
}
function getWatcher(key, effect, model, onEffect, onError) {
  function put(action) {
    return sagaEffects.put({ ...action, type: prefixType(action.type, model) });
  }
  return function* () {
    if (onEffect) {// onEffect=[onEffect(effect, { put }, model, actionType)]
      for (const fn of onEffect) {
        effect = fn(effect, { ...sagaEffects, put }, model, key);
      }
    }
    // key=counter/asyncAdd   counter/
    yield sagaEffects.takeEvery(key, function* (...args) {
      try {
        yield effect(...args, { ...sagaEffects, put });
      } catch (error) {
        onError.forEach(fn => fn(error));
      }

    });
  }
}

// 此方法就是把reducers对象的属性名从add变成counter/add

function prefix(obj, namespace) {
  return Object.keys(obj).reduce((memo, key) => {
    let newKey = `${namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = obj[key];
    return memo;
  }, {});
}
function prefixNamespace(model) {
  if (model.reducers) {
    model.reducers = prefix(model.reducers, model.namespace);
  }
  if (model.effects) {
    model.effects = prefix(model.effects, model.namespace);
  }
  return model;
}
