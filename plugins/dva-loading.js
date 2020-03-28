const SHOW = '@@DVA_LOADING/SHOW'; // 当执行saga之前派发的动作
const HIDE = '@@DVA_LOADING/HIDE'; // 当saga执行结束之后派发的动作
const NAMESPACE = 'loading'; // 命名空间 { }
export default function createLoading(options) {
  let initialState = {
    global: false,
    models: {},
    effects: {}
  }
  const extraReducers = {
    [NAMESPACE](state = initialState, { type, payload }) {
      let { namespace, actionType } = payload || {};
      switch (type) {
        case SHOW:
          return {
            ...state,
            global: true,
            models: {
              ...state.models, [namespace]: true
            },
            effects: {
              ...state.effects,
              [actionType]: true
            }
          }
        case HIDE: {
          let effects = { ...state.effects, [actionType]: false };
          // effects={counter1/asyncAdd:true,counter2/asyncMinus:false}
          let models = {
            ...state.models,
            [namespace]: Object.keys(effects).some(actionType => {
              const _namespace = actionType.split('/')[0]; // counter1/asyncAdd
              if (_namespace !== namespace) {
                return false;
              }
              return effects[actionType];
            })
          }
          const global = Object.keys(models).some(namespace => {
            return models[namespace];
          });
          return {
            effects,
            models,
            global
          }
        }
        default:
          return state;
      }
    }
  }

  // saga effect  sagaEffect put派发动作  model代表当前模型 actionType代表动作类型
  function onEffect(effect, { put }, model, actionType) {
    const { namespace } = model;// counter
    return function* (...args) {
      try {
        yield put({ type: SHOW, payload: { namespace, actionType } });
        yield effect(...args);
      } finally {
        yield put({ type: HIDE, payload: { namespace, actionType } });
      }
    }
  }
  return {
    onEffect,
    extraReducers // {loading:function(){}}
  }
}
