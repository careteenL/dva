import React from 'react';
import dva, { connect } from 'dva';
import { Router, Route, Link, routerRedux } from 'dva/router';
import createLoading from '../../../plugins/dva-loading';
import { delay } from '../../../utils';
let { ConnectedRouter, push } = routerRedux;

let app = dva({
  onError(e) {
    alert(e);
  }
});
app.use(createLoading());
app.model({
  namespace: 'counter',
  state: { number: 0 },
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
    minus(state) {
      return { number: state.number - 1 };
    }
  },
  effects: {
    *asyncAdd(action, { put }) {
      yield delay(3000);
      throw new Error('我是Counter asyncAdd的错误'); // ++
      yield put({ type: 'add' });
    }
  },
  subscriptions: {
    changeTitle({ history, dispatch }, done) {
      history.listen(({ pathname }) => {
        document.title = pathname;
      });
      done('我是subscriptions changeTitle changeTitle错误'); // ++
    }
  }
});
function Counter(props) {
  return (
    <div>
      <p>{props.loading ? <span>执行中</span> : props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter/add" })}>加1</button>
      <button disabled={props.loading} onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>异步+</button>
    </div>
  )
}
const ConnectedCounter = connect(
  (state) => ({
    ...state.counter,
    loading: state.loading.models.counter
  })
)(Counter);
const Home = (props) => (
  <div>
    <p>Home</p>
    <button onClick={() => props.dispatch(push('/counter'))}>跳到/counter</button>
  </div>
)
const ConnectedHome = connect(
  (state) => state
)(Home);

app.router(({ history, app }) => {
  return (
    <ConnectedRouter history={history}>
      <>
        <ul>
          <li><Link to="/">home</Link></li>
          <li><Link to="/counter">counter</Link></li>
        </ul>
        <Route path="/" exact component={ConnectedHome} />
        <Route path="/counter" component={ConnectedCounter} />
      </>
    </ConnectedRouter>
  )
});
app.start('#root');
