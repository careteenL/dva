const colors = {
  prevState: '#9E9E9E',
  action: '#03A9F4',
  nextState: '#4CAF50',
}
const logger = ({ dispatch, getState }) => next => action => {
  let prevState = getState();
  next(action);
  let nextState = getState();
  //action @@router/LOCATION_CHANGE @ 14:56:09.873
  console.group(`%caction %c${action.type} %c@${new Date().toLocaleTimeString()}`,
    `color:gray;font-weight:lighter`,
    `color:inherit;font-weight:bold`,
    `color:gray;font-weight:lighter`
  );
  console.log('%cprev state', `color:${colors.prevState};font-weight:lighter`, prevState);
  console.log('%caction', `color:${colors.action};font-weight:lighter`, action);
  console.log('%cnext state', `color:${colors.nextState};font-weight:lighter`, nextState);
  console.groupEnd();
}

export default logger;
