import React from 'react';
import dva, { connect } from 'dva';
import { Router, Route, Link, routerRedux } from 'dva/router';
import createLoading from '../../../plugins/dva-loading';
import dynamic from '../../../src/dynamic';
import { delay } from '../../../utils';
let { ConnectedRouter, push } = routerRedux;

let app = dva({});
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
      yield put({ type: 'add' });
    }
  },
  subscriptions: {
    changeTitle({ history, dispatch }, done) {
      history.listen(({ pathname }) => {
        document.title = pathname;
      });
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
    ...state.present.counter,
    loading: state.present.loading.models.counter
  })
)(Counter);
const Home = (props) => (
  <div>
    <p>Home</p>
    <button onClick={() => props.dispatch(push('/counter'))}>跳到/counter</button>
  </div>
)
const ConnectedHome = connect(
  (state) => state.present
)(Home);
const UsersPage = dynamic({
  app,
  models: () => [import(/* webpackChunkName: "users" */'./models/users')],
  component: () => import(/* webpackChunkName: "users" */'./routes/UsersPage')
});
app.router(({ history, app }) => {
  return (
    <ConnectedRouter history={history}>
      <>
        <ul>
          <li><Link to="/">home</Link></li>
          <li><Link to="/counter">counter</Link></li>
          <li><Link to="/users">users</Link></li>
        </ul>
        <Route path="/" exact component={ConnectedHome} />
        <Route path="/counter" component={ConnectedCounter} />
        <Route path="/users" component={UsersPage} />
      </>
    </ConnectedRouter>
  )
});
app.start('#root');
