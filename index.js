export default (...epics) => store => {
  const handlers = [];

  const action$ = (start, sink) => {
    if (start !== 0) return;
    const handler = action => sink(1, action);
    sink(0, t => {
      if (t === 2) {
        handlers.splice(handlers.indexOf(handler), 1);
      }
    });
    handlers.push(handler);
  }

  epics.forEach(epic => {
    const source = epic(action$, store);
    source(0, (t, d) => {
      if (t === 1) {
        store.dispatch(d);
      }
    });
  });
  
  return next => action => {
    const result = next(action);
    handlers.forEach(handler => handler(action));
    return result;
  }
}

export const ofType = type => source => (start, sink) => {
  if (start !== 0) return;
  source(0, (t, d) => {
    if (t === 1) {
      if (d.type === type) sink(1, d);
    } else sink(t, d);
  });
}