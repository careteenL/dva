const hooks = [
  "onEffect",// 用来增强effect
  "extraReducers",//  添加额外的reducers
  "onAction",
  "onStateChange",
  "onReducer",
  "extraEnhancers",
  "_handleActions",
  "onError"
]
/**
 * 把那些不是hooks的属性去掉
 * @param {} options 
 */
export function filterHooks(options) {
  return Object.keys(options).reduce((memo, key) => {
    if (hooks.indexOf(key) > -1) {
      memo[key] = options[key]
    }
    return memo;
  }, {});
}

export default class Plugin {
  constructor() {
    // this.hooks ={onEffect:[],extractReducers:[]}
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {});
  }
  // 插件就是一个对象，它的属性就是钩子函数
  // use接收钩子函数，然后缓存在当前实例 hooks属性上
  use(plugin) {
    const { hooks } = this;
    for (let key in plugin) {// plugin={ onAction: createLogger()  key=onEffect
      if (key === 'extraEnhancers') {
        // hooks.extraEnhancers
        hooks[key] = plugin[key];
      } else if (key === '_handleActions') {
        this._handleActions = plugin[key];
      } else {
        hooks[key].push(plugin[key]);
      }
    }
  }
  get(key) { // extraReducers
    const { hooks } = this;
    if (key === 'extraReducers') {
      return getExtraReducers(hooks[key]);
    } else if (key === "onReducer") {
      return getOnReducer(hooks[key]);
    } else {
      return hooks[key];
    }
  }
}
function getOnReducer(hook) {
  return function (reducer) {
    for (const reduceEnhancer of hook) {
      reducer = reduceEnhancer(reducer);
    }
    return reducer;
  }
}
function getExtraReducers(hook) {// 数组 [{key1:reducer1,key2:reducer2},{key3:reducer3,key4:reducer4}]
  let ret = {};
  for (let reducerObject of hook) {// {key1:reducer1,key2:reducer2} {key3:reducer3,key4:reducer4}]
    ret = { ...ret, ...reducerObject };
  }
  return ret;// {key1,key2,key3,key4}
  // return Object.assign({},...hook);
  /**
   * {key1,key2}
   * {key3,key4}
   * {key1,key:2,key3:key3}
   * state=
   * {
   * key1:xx,
   * key2:xx
   * key3:xx
   * key3:xx
   * }
   */
}
