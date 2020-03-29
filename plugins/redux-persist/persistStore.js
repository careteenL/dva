import { PERSIST_INIT } from './constants';

export default function (store) {
  let persistor = {
    ...store,
    initState() {
      persistor.dispatch({
        type: PERSIST_INIT
      })
    }
  }
  return persistor;
}
